export default function  playAudio(src:string, volume:number = 1) {
  try {
    const audio  = new Audio(src);
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);
    source.connect(ctx.destination);
    audio.play();
    audio.volume = volume;
  } catch (err) {
    console.error("ошибка с воспроизведением аудио:", err)
  }
}