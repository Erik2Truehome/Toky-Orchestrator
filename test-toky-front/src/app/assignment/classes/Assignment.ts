import { BusinessTarget } from 'src/app/telephony-port/interfaces/IPort';
import { IAssignment } from '../interfaces/IAssignment';
import { AssignmentStatus } from './constant/AssignmentStatus';

export class Assignment implements IAssignment {
  public get id(): string {
    return this._id;
  }

  public get status(): AssignmentStatus {
    return this._status;
  }

  public get businessTarget(): BusinessTarget {
    return { ...this._businessTarget };
  }

  public get scheduledDate(): Date | undefined {
    return this._scheduledDate;
  }

  private _id: string;
  private _status: AssignmentStatus;
  private _businessTarget: BusinessTarget;
  private _scheduledDate?: Date | undefined;

  constructor(
    id: string,
    businessT: BusinessTarget,
    status?: AssignmentStatus,
    scheduledDate?: Date | undefined
  ) {
    this._id = id;
    this._businessTarget = businessT;
    this._scheduledDate = scheduledDate;

    if (status) {
      this._status = status;
    } else {
      this._status = AssignmentStatus.PENDING_PROCESS;
    }
  }
}
