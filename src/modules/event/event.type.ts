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

export const EventDITypes = {
  REPOSITORY: Symbol.for("EVENT_REPOSITORY"),
  SERVICE: Symbol.for("EVENT_SERVICE"),
  CONTROLLER: Symbol.for("EVENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("EVENT_AUTHORIZATION"),
} as const;

export type EventModel = {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};
