/*

ActionsContext

export const baseWsUrl =
  window.location.protocol.replace("http", "ws") +
  `//${window.location.host}/ws/`;

type WSMessage<D = {}> = {
  action: string;
  group: string;
  data: D;
};

class WSService {
  private ws: WebSocket | null = null;

  private actions: { [action: string]: Function } = {};

  constructor(protected baseUrl = baseWsUrl) {}

  init() {
    this.ws = new WebSocket(this.baseUrl);

    this.ws.onopen = () => {
      console.info("WS open");
    };

    this.ws.onclose = () => {
      console.info("WS closed");
    };

    this.ws.onerror = (e) => {
      console.info("WS error:", e);
    };

    this.ws.onmessage = (e) => {
      const { action, data }: WSMessage = JSON.parse(e.data);
      this.actions[action](data);
    };
  }

  addAction<D>(action: string, onReceive: (messageData: D) => void) {
    this.actions[action] = onReceive;

    const senderFn = (group: string, data: D) => {
      const message: WSMessage<D> = { action, group, data };
      try {
        this.ws?.send(JSON.stringify(message));
      } catch (err) {
        console.info("WS send error:", err);
      }
    };

    return senderFn;
  }
}

const wsService = new WSService();

export default function ProvideActions(props: { children: React.ReactNode }) {

  const { current: WSS } = useRef(wsService);

  const wsProjectUpdate = WSS.addAction(
    "project/update",
    (data: { project: IProject }) => {
      dispatch(projectsSlice.updateProject(data.project));
    },
  );

  const wsProjectAddMember = WSS.addAction(
    "project/addMember",
    (data: { projectId: IProject["id"]; user: IUser }) => {
      dispatch(
        projectsSlice.addMember({
          projectId: data.projectId,
          userId: data.user.id,
        }),
      );
      dispatch(usersSlice.loadUsers({ [data.user.id]: data.user }));
    },
  );

  // ...

  return (
    <ActionsContext.Provider value={actions}>
      {props.children}
    </ActionsContext.Provider>
  );
}

*/
