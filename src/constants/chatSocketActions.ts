export const chatSocketAction = {
  C_JOIN_ROOM: "clientJoin",
  C_LEAVE_ROOM: "clientLeave",

  S_USER_ONLINE_STATUS: "userOnlineStatus",

  C_SEND_MSG: "clientSendMessageRoom",
  S_SEND_MSG: "serverSendMessageRoom",

  C_SEEN_MSG: "clientSeen",
  S_SEEN_MSG: "serverSeen",

  C_DELETE_ROOM: "clientDeleteRoom",
  S_DELETE_ROOM: "serverDeleteRoom",
};
// export enum chatSocketAction {
//   C_JOIN_ROOM,
//   C_LEAVE_ROOM,

//   S_USER_ONLINE_STATUS,

//   C_SEND_MSG,
//   S_SEND_MSG,

//   C_SEEN_MSG,
//   S_SEEN_MSG,

//   C_DELETE_ROOM,
//   S_DELETE_ROOM,
// }
