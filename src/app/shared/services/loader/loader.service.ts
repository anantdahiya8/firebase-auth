import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  /**
   * Signal that represents whether the global loader should be shown.
   * Components/templates can read it with `loaderService.showLoader()` in templates.
   */
  public showLoader: WritableSignal<boolean> = signal(false);

  constructor() { }

  /** Show the loader */
  public show(): void {
    this.showLoader.set(true);
  }

  /** Hide the loader */
  public hide(): void {
    this.showLoader.set(false);
  }

}
