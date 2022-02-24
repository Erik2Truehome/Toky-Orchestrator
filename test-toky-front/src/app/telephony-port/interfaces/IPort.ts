import { ICall } from './ICall';

export interface Country {
  name?: string;
  code?: string;
}

export interface Telephone {
  areaCode: string;
  number: string;
  country?: Country;
}

export interface Agent {
  email: string;
  name: string;
  lastName: string;
  image?: string;
  telephoneForwarding?: Telephone;
}

export interface Lead {
  email: string;
  name: string;
  lastName: string;
  telephone: Telephone;
  image?: string;
}

// export enum PortRegistrationStatus {
//   REGISTERED, //En Toky es REGISTERED
//   UNREGISTERED, //En Toky es UNREGISTERED
//   REFRESHING_TOKEN, //cuando se tiene que refrescar el token, en Toky no existe
// }
export class PortRegistrationStatus {
  public static REGISTERED = 'REGISTERED'; //En Toky es REGISTERED
  public static UNREGISTERED = 'UNREGISTERED'; //En Toky es UNREGISTERED
  public static REGISTERING = 'REGISTERING'; //En Toky es REGISTERING
  public static FAILED = 'REGISTRATION_FAILED'; //En Toky es REGISTRATION_FAILED
  public static REFRESHING_TOKEN = 'REFRESHING_TOKEN'; //cuando se tiene que refrescar el token, en Toky no existe
}

// export enum PortStatus {
//   READY, //Puerto lISTO para inciar una nueva marcacion
//   STARTING_OUTBOUND_CALL, //En Toky es CONNECTING, cuando se inicia una llamada
//   RINGING, // El numero destinatario empieza a sonar
//   ANSWERED, // Cuando el destinatario contesta la llamada,
//   DIALOG, // Para indicar que el Lead sigue en la linea y no hay ningun error
//   HOLD, // Cuando se pone en espera una llamada, se le reproduce un audio default automaticamente a el Lead

//   TRANSFERRING, //enviando una llamada a otro Agente o destinatario
//   SUCCESSFUL_TRANSFER, // Cuando una trasferencia se realizó de forma exitosa
//   END_CALL, //Llamada finalizada, porque alguien colgó o por un error

//   ERROR, // Para indicar que ocurrió un error, despues de un tiempo el Puerto deberia de pasar a   READY
//   //despues de varios errores seguidos que pasé a el estado de Para dejarlo revisarlo un inge de soporte

//   FREQUENT_ERRORS,

//   STARTING_INBOUND_CALL, //En Toky es INVITE, cuando se inicia una llamada
// }

export class PortStatus {
  public static REGISTRATION_ERROR = 'REGISTRATION ERROR';
  public static CREATED = 'CREATED';
  public static INITIALIZING = 'INITIALIZING';
  public static READY = 'READY'; //Puerto lISTO para inciar una nueva marcacion
  public static RESERVED = 'RESERVED';
  public static RESERVED_TO_TRANSFER = 'RESERVED TO TRANSFER';
  public static STARTING_OUTBOUND_CALL = 'STARTING OUTBOUND CALL'; //En Toky es CONNECTING, cuando se inicia una llamada
  public static DIALING = 'DIALING'; // El numero destinatario (callee) empieza a sonar

  public static CONNECTED = 'CONNECTED'; // Cuando existe un enlace entre caller y callee, sin importar si es inbound or outbound call

  public static RINGING = 'RINGING'; // Tu propio softphone empezó a sonar

  public static HOLD = 'HOLD'; // Cuando se pone en espera una llamada, se le reproduce un audio default automaticamente a el Lead, este no lo uses porque ya no podras sacarlo de hold nunca

  public static TRANSFERRING = 'TRANSFERRING'; //enviando una llamada a otro Agente o destinatario
  public static TRANSFER_SUCCESS = 'TRANSFER SUCCESS'; // Cuando una trasferencia se realizó de forma exitosa
  public static TRANSFER_FAILED = 'TRANSFER FAILED';

  public static END_CALL = 'END_CALL'; //Llamada finalizada, porque alguien colgó (ya sea el caller o el callee) o por un error

  public static ERROR = 'ERROR'; // Para indicar que ocurrió un error, despues de un tiempo el Puerto deberia de pasar a READY
  //despues de varios errores seguidos que pasé a el estado ERROR ya dejalo en estado ERROR y deslogea a el agente Para dejar evitar que siga recibiendo
  //mas llamadas pues el agente esta fallando y serán Lead perdidos.

  public static STARTING_INBOUND_CALL = 'STARTING_INBOUND_CALL'; //En Toky es INVITE, cuando se inicia una llamada
}

export interface BusinessTarget {
  lead: Lead;
  agentAssigned: Agent;
}

export interface CurrentInfoPort {
  registrationStatus: PortRegistrationStatus;
  status: PortStatus;
  businessTarget?: BusinessTarget;
}

export interface IPort {
  idDatabase: number;
  agentLinked: Agent;
  currentInfo: CurrentInfoPort;
  country: Country;
  call: ICall | null;
  portXfer: IPort | null;

  //methods
  freePort(): void;
}
