import * as jspb from 'google-protobuf'



export class RegisterContributorRequest extends jspb.Message {
  getCorporateId(): string;
  setCorporateId(value: string): RegisterContributorRequest;

  getGithubUsername(): string;
  setGithubUsername(value: string): RegisterContributorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterContributorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterContributorRequest): RegisterContributorRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterContributorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterContributorRequest;
  static deserializeBinaryFromReader(message: RegisterContributorRequest, reader: jspb.BinaryReader): RegisterContributorRequest;
}

export namespace RegisterContributorRequest {
  export type AsObject = {
    corporateId: string,
    githubUsername: string,
  }
}

export class RegisterContributorResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): RegisterContributorResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterContributorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterContributorResponse): RegisterContributorResponse.AsObject;
  static serializeBinaryToWriter(message: RegisterContributorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterContributorResponse;
  static deserializeBinaryFromReader(message: RegisterContributorResponse, reader: jspb.BinaryReader): RegisterContributorResponse;
}

export namespace RegisterContributorResponse {
  export type AsObject = {
    message: string,
  }
}

export class GetContributorRequest extends jspb.Message {
  getCorporateId(): string;
  setCorporateId(value: string): GetContributorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetContributorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetContributorRequest): GetContributorRequest.AsObject;
  static serializeBinaryToWriter(message: GetContributorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetContributorRequest;
  static deserializeBinaryFromReader(message: GetContributorRequest, reader: jspb.BinaryReader): GetContributorRequest;
}

export namespace GetContributorRequest {
  export type AsObject = {
    corporateId: string,
  }
}

export class GetContributorResponse extends jspb.Message {
  getCorporateId(): string;
  setCorporateId(value: string): GetContributorResponse;

  getGithubUsername(): string;
  setGithubUsername(value: string): GetContributorResponse;

  getApprovedProjectsList(): Array<string>;
  setApprovedProjectsList(value: Array<string>): GetContributorResponse;
  clearApprovedProjectsList(): GetContributorResponse;
  addApprovedProjects(value: string, index?: number): GetContributorResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetContributorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetContributorResponse): GetContributorResponse.AsObject;
  static serializeBinaryToWriter(message: GetContributorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetContributorResponse;
  static deserializeBinaryFromReader(message: GetContributorResponse, reader: jspb.BinaryReader): GetContributorResponse;
}

export namespace GetContributorResponse {
  export type AsObject = {
    corporateId: string,
    githubUsername: string,
    approvedProjectsList: Array<string>,
  }
}

