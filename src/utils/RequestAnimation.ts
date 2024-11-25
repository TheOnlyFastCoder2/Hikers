class RequesAnimation  {
  public frameID: number = 0;
  private timer:number = 0;

  private callback: Function|undefined;
  private updateFrequency:number = 0;

  private totalTime:number = 0;
  private startTime:number = performance.now();
  private isCanvasVisible = true;

  private readonly deviation = 4;
  private readonly deltaNorm = 1000/60 + this.deviation;

  init (freq:number, callback: (deltaTime: number) => void) 
  { 
    this.callback = callback;
    this.updateFrequency = freq;
  }
  
  cancelFrameAnimation () {
    cancelAnimationFrame(this.frameID);
  }

  toStartFrame()  {
    const deltaTime = (performance.now() - this.startTime) - this.totalTime;
    this.totalTime = deltaTime + this.totalTime;

    if(this.isCanvasVisible && deltaTime < this.deltaNorm) {
      this.update(deltaTime,this.callback!);
    }

    this.cancelFrameAnimation();
    this.frameID = window.requestAnimationFrame(
      this.toStartFrame.bind(this)
    );
  }

  private update(deltaTime: number, callback:Function) {
    this.timer += deltaTime / 1000; 
    if(this.timer > this.updateFrequency) {
      this.timer -= this.updateFrequency;
      callback.call(null, this.timer);
    }
  }

}

export default RequesAnimation;