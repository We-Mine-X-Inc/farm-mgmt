import request from "supertest";
import App from "@/app";
import IndexRoute from "@routes/index.route";
import { agendaSchedulerManager } from "@scheduler/agenda-scheduler-manager";
import { dbConnection } from "@databases";

const indexRoute = new IndexRoute();
let app;

beforeAll(async () => {
  await dbConnection.disconnect();
  app = new App([indexRoute]);
});

describe("Testing Index", () => {
  describe("[GET] /", () => {
    it("response statusCode 200", () => {
      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});
