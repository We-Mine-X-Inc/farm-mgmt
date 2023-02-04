import { assertInventoryItem } from "@/interfaces/assertions/inventory-item";
import { Miner } from "@/interfaces/miner.interface";

export function isHashrateWithinBounds(params: {
  miner: Miner;
  actualHashrate: number;
}) {
  const inventoryItem = params.miner.inventoryItem;
  assertInventoryItem(inventoryItem);

  const expectedHashRateRange =
    inventoryItem.operationalMetadata?.minerMetadata?.expectedHashRateRange;
  return (
    expectedHashRateRange.minimum <= params.actualHashrate &&
    params.actualHashrate <= expectedHashRateRange.maximum
  );
}

export function isFanSpeedWithinBounds(params: {
  miner: Miner;
  actualFanSpeed: number;
}) {
  const inventoryItem = params.miner.inventoryItem;
  assertInventoryItem(inventoryItem);

  const expectedFanSpeedRange =
    inventoryItem.operationalMetadata?.minerMetadata?.expectedFanSpeedRange;
  return (
    expectedFanSpeedRange.minimum <= params.actualFanSpeed &&
    params.actualFanSpeed <= expectedFanSpeedRange.maximum
  );
}

export function isInletTempWithinBounds(params: {
  miner: Miner;
  actualTemperature: number;
}) {
  const inventoryItem = params.miner.inventoryItem;
  assertInventoryItem(inventoryItem);

  const expectedInletTempRange =
    inventoryItem.operationalMetadata?.minerMetadata?.expectedInletTempRange;
  return (
    expectedInletTempRange.minimum <= params.actualTemperature &&
    params.actualTemperature <= expectedInletTempRange.maximum
  );
}

export function isOutletTempWithinBounds(params: {
  miner: Miner;
  actualTemperature: number;
}) {
  const inventoryItem = params.miner.inventoryItem;
  assertInventoryItem(inventoryItem);

  const expectedOutletTempRange =
    inventoryItem.operationalMetadata?.minerMetadata?.expectedOutletTempRange;
  return (
    expectedOutletTempRange.minimum <= params.actualTemperature &&
    params.actualTemperature <= expectedOutletTempRange.maximum
  );
}
