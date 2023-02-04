import { NextFunction, Router, Request, Response } from "express";
import { Routes } from "@interfaces/routes.interface";
import path from "path";
import QRCode from "qrcode";
import FacilityInfoService from "@/services/facility-info.service";

class FacilitySetupRoute implements Routes {
  public path = "/facility-setup";
  public router = Router();
  private facilityInfoService = new FacilityInfoService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      async (req: Request, res: Response, next: NextFunction) => {
        res.send(generateIndexHTML());
      }
    );
    this.router.get(
      `${this.path}/qrcode/:id`,
      async (req: Request, res: Response) => {
        QRCode.toDataURL(
          `https://ec2-3-144-163-98.us-east-2.compute.amazonaws.com:5000/miner/${req.params.id}`
        ).then((url) => res.send(`<img src=${url}>`));
      }
    );
  }
}

export default FacilitySetupRoute;

const generateIndexHTML = () => `
<html>

<head>
    <title>Facility Setup/Testing</title>
</head>

<body>
    <h2>Generate QR Code for Friendly Miner Id</h2>
    <div>
        <input id="friendlyMinerId" placeholder="Friendly Miner ID" />
        <button onclick="generateCode()">Generate QR Code</button>
        <script type="text/javascript">
            function generateCode() {
                const friendlyMinerId = document.getElementById("friendlyMinerId").value;
                window.location.href = '/facility-setup/qrcode/' + friendlyMinerId;
            }
        </script>
    </div>
</body>

</html>
`;
