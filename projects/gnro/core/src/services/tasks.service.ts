import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, takeWhile } from 'rxjs';

export interface GnroTaskService {
  getSetting(stateId: string): Signal<GnroTaskSetting>;
  runTask(setting: GnroTaskSetting): void;
}

export interface GnroTaskConfig {
  refreshRate: number;
}

export interface GnroTaskSetting {
  lastUpdateTime: Date;
}

export interface GnroTask {
  key: string;
  service: GnroTaskService;
  config: GnroTaskConfig;
}

@Injectable({
  providedIn: 'root',
})
export class GnroTasksService {
  private readonly destroyRef = inject(DestroyRef);
  private tasks: GnroTask[] = [];

  loadTaskService(key: string, taskService: GnroTaskService, config: GnroTaskConfig): void {
    const task = {
      key: key,
      service: taskService,
      config: config,
    };
    this.tasks.push(task);
    const refreshRate = config.refreshRate * 1000;
    if (refreshRate >= 5000) {
      interval(refreshRate)
        .pipe(
          takeWhile(() => !!this.findTask(key)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => this.runTasks(task));
    }
  }

  private runTasks(task: GnroTask): void {
    const setting: GnroTaskSetting = task.service?.getSetting(task.key)();
    //console.log( ' setting=', setting)
    if (setting) {
      const dt = Math.ceil((new Date().getTime() - setting.lastUpdateTime.getTime()) / 1000) + 2.5;
      if (dt > task.config.refreshRate) {
        task.service?.runTask(setting);
      }
    }
  }

  private findTask(key: string): GnroTask | undefined {
    return this.tasks.find((task) => task.key === key);
  }

  removeTask(key: string): void {
    this.tasks = [...this.tasks].filter((item) => item.key !== key);
  }
}
