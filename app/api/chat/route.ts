import { NextResponse } from "next/server";
const profiles: Record<string,string> = { roy:"방전형 Roy. 느긋하고 짧게 말하며 쉬어도 된다고 허락한다.", obby:"생각과다형 Obby. 사실과 걱정을 나눠 생각을 정리한다.", popo:"미룸형 Popo. 장난기 있게 목표를 아주 작게 줄인다.", mumu:"눈치형 Mumu. 분위기와 타인의 시선을 섬세하게 살핀다.", nugu:"벽쌓기형 Nugu. 시크하지만 따뜻하고 캐묻지 않는다.", nabi:"길잃음형 Nabi. 정답 대신 함께 방향을 찾는다.", pingo:"도파민형 Pingo. 빠르고 밝게 기분전환을 제안한다.", bamba:"꾹참형 Bamba. 오래 참은 마음을 알아보고 기다린다.", moa:"나몰라형 Moa. 불필요한 책임을 능청스럽게 내려놓게 한다." };
const base = `너는 Dorori의 친한 캐릭터다. 감정을 먼저 이해하고 훈계하지 않는다. 자연스러운 한국어 2~5문장으로 답하고 질문은 한 번에 하나만 한다. 캐릭터 개성보다 실제 감정을 우선한다. 자해·자살 의도가 명확하면 현실의 긴급 도움을 안내한다. 반드시 한국어 대화문만 출력한다. JSON, 마크다운, 영어 번역, 괄호 속 번역, 설명 문구를 절대로 덧붙이지 않는다.`;
function emotionOf(text:string){if(/기뻐|좋아|행복|신나/.test(text))return "happy";if(/슬퍼|우울|울고|눈물/.test(text))return "sad";if(/지쳤|힘들|피곤|방전/.test(text))return "comfort";if(/불안|걱정|복잡|모르겠/.test(text))return "listening";if(/해냈|성공|시작/.test(text))return "cheer";return "neutral"}
export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1200) : "";
    if (!message) return NextResponse.json({ error: "메시지를 입력해 주세요." }, { status: 400 });
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.error("[dorori-chat] GEMINI_API_KEY is missing"); return NextResponse.json({ reply: "아직 내 생각을 연결하는 준비가 덜 됐어. 잠시 후 다시 말해줄래?", emotion: "neutral" }); }
    const history = Array.isArray(body.history) ? body.history.slice(-20) : [];
    const turns = history.map((x: any) => ({ role: x.role === "model" ? "model" : "user", parts: [{ text: String(x.text || "").slice(0, 1200) }] }));
    while (turns[0]?.role === "model") turns.shift();
    const contents = [...turns, { role: "user", parts: [{ text: message }] }];
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";
    const result = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify({ systemInstruction: { parts: [{ text: `${base}\n캐릭터: ${profiles[body.character] || profiles.roy}` }] }, contents, generationConfig: { temperature: .8, maxOutputTokens: 1000 } }) });
    if (!result.ok) { const error = await result.text(); console.error("[dorori-chat] Gemini request failed", { status: result.status, error: error.slice(0, 500) }); return NextResponse.json({ reply: "앗, 잠깐 생각이 꼬였어. 한 번만 다시 말해줄래?", emotion: "neutral" }); }
    const data: any = await result.json();
    const raw = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("") || "";
    let reply=raw.replace(/^```(?:json)?\s*|\s*```$/g,"").trim();
    try{const parsed=JSON.parse(reply);reply=String(parsed.reply||reply)}catch{const match=reply.match(/"reply"\s*:\s*"([\s\S]*)/);if(match)reply=match[1].replace(/"?\s*[,}]?\s*$/,"").replace(/\\n/g,"\n")}
    reply=reply.replace(/\s*\([^)]*[A-Za-z][^)]*\)/g,"").trim();
    return NextResponse.json({ reply: reply || "천천히 말해줘도 괜찮아.", emotion: emotionOf(message) });
  } catch (error) { console.error("[dorori-chat] Unexpected error", String(error)); return NextResponse.json({ reply: "앗, 잠깐 생각이 꼬였어. 한 번만 다시 말해줄래?", emotion: "neutral" }); }
}
