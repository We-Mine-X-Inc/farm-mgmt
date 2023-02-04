import { Agenda } from "agenda/es";

const schedulers = [];

export const agendaSchedulerManager = {
  create: (options: any): Agenda => {
    const scheduler = new Agenda(options);
    schedulers.push(scheduler);
    return scheduler;
  },
  closeAll: async () => {
    for (const scheduler of schedulers) {
      console.log(await scheduler.stop());
    }
  },
};
