import { BusinessTarget } from 'src/app/telephony-port/interfaces/IPort';
import { AssignmentStatus } from '../classes/constant/AssignmentStatus';

export interface IAssignment {
  id: string;
  status: AssignmentStatus;
  businessTarget: BusinessTarget;
  scheduledDate?: Date;

  //methods
}
