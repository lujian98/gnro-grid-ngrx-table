import { ClassProvider, Injectable, Injector, inject } from '@angular/core';
import { interval, take, takeWhile } from 'rxjs';

export interface GnroTaskConfig {
  refreshRate: number;
}

export interface GnroTaskSetting {
  lastUpdateTime: Date;
}

export interface GnroTask {
  key: string;
  service?: any;
  config: GnroTaskConfig;
}

@Injectable({
  providedIn: 'root',
})
export class GnroTasksService {
  private readonly injector = inject(Injector);
  private tasks: GnroTask[] = [];

  loadTaskService(key: string, provide: any, config: GnroTaskConfig): void {
    const injector = Injector.create({
      parent: this.injector,
      providers: [provide],
    });
    const task = {
      key: key,
      service: injector.get(provide),
      config: config,
    };
    this.tasks.push(task);
    const refreshRate = config.refreshRate * 1000;
    if (refreshRate >= 5000) {
      interval(refreshRate)
        .pipe(takeWhile(() => !!this.findTask(key)))
        .subscribe(() => this.runTasks(task));
    }
  }

  private runTasks(task: GnroTask): void {
    task.service
      ?.selectSetting(task.key)
      .pipe(take(1))
      .subscribe((setting: GnroTaskSetting) => {
        const dt = Math.ceil((new Date().getTime() - setting.lastUpdateTime.getTime()) / 1000) + 2.5;
        if (dt > task.config.refreshRate) {
          task.service?.runTask(setting);
        }
      });
  }

  private findTask(key: string): GnroTask | undefined {
    return this.tasks.find((task) => task.key === key);
  }

  removeTask(key: string): void {
    this.tasks = [...this.tasks].filter((item) => item.key !== key);
  }
}
