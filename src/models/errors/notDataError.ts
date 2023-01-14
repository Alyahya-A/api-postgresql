import { StatusCode } from "../../consts/statusCodes";
import { BaseError } from "./baseError";
import { v4 as uuidv4 } from "uuid";

export class NotDataFoundError extends BaseError {
  public readonly errorCode: number;

  constructor() {
    super("No data found", StatusCode.notFound, "", true);
    this.errorCode = 4000;
  }
}
