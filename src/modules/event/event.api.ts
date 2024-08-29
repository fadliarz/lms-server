import { EventModel } from "./event.type";

export namespace $EventAPI {
  const root = "/events";
  const event = root + "/:eventId";

  export namespace CreateEvent {
    export const endpoint = root;
    export const generateUrl = () => root;
    export type Dto = {
      title: string;
      description?: string;
      date: Date;
    };
    export type Response = {
      data: EventModel;
    };
  }

  export namespace GetEvents {
    export const endpoint = root;
    export const generateUrl = () => root;
    export type Response = {
      data: EventModel[];
    };
  }

  export namespace GetEventById {
    export const endpoint = event;
    export const generateUrl = (eventId: number) => `/events/${eventId}`;
    export type Response = {
      data: EventModel;
    };
  }

  export namespace UpdateEvent {
    export const endpoint = event;
    export const generateUrl = (eventId: number) => `/events/${eventId}`;
    export type Dto = {
      title?: string;
      description?: string;
      date?: Date;
    };
    export type Response = {
      data: EventModel;
    };
  }

  export namespace DeleteEvent {
    export const endpoint = event;
    export const generateUrl = (eventId: number) => `/events/${eventId}`;
    export type Response = {
      data: {};
    };
  }
}
