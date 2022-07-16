import { Agenda } from "agenda/es";
import { dbConnection } from "@databases";

const agenda = new Agenda({ db: { address: dbConnection } });

agenda.define(
    "switch miners to client pool",
    async (job) => {
        const { miningBatchInfo } = job.attrs.data;
    }
);

agenda.define(
    "switch miners to company pool",
    async (job) => {
        const { miningBatchInfo } = job.attrs.data;
    }
);