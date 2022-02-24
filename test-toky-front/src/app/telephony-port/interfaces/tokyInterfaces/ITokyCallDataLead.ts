export interface ITokyCallDataLead {
  uri: URI;
  type: string;
  phone: string;
}

export interface URI {
  parameters: Parameters;
  headers: Headers;
  raw: Normal;
  normal: Normal;
}

export interface Headers {}

export interface Normal {
  scheme: string;
  user: string;
  host: string;
}

export interface Parameters {
  company: string;
  dnis: string;
}

/*
asi se ve en json
{
  "uri": {
    "parameters": {
      "company": "41441",
      "dnis": "+525514837767"
    },
    "headers": {},
    "raw": {
      "scheme": "sip",
      "user": "service",
      "host": "app.toky.co"
    },
    "normal": {
      "scheme": "sip",
      "user": "service",
      "host": "app.toky.co"
    }
  },
  "type": "contact",
  "phone": "+525514837767"
}

*/
