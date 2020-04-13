import React from "react";
import { isEmpty, isLoaded } from "react-redux-firebase";
import { Redirect, useParams } from "react-router-dom";

import { useUserId } from "../../auth";

import { useConnectedRoom } from "../hooks";

import RoomLobby from "../RoomLobby";

interface RoomHomeRouteParams {
  roomId: string;
}

function Room() {
  const { roomId } = useParams<RoomHomeRouteParams>();

  const userId = useUserId();

  const [room, members] = useConnectedRoom(roomId);

  if (!roomId || (isLoaded(room) && isEmpty(room))) {
    return <Redirect to="/online" />;
  }

  if (isLoaded(members) && !isEmpty(members)) {
    return <RoomLobby roomId={roomId} userId={userId} members={members} />;
  }

  return null;
}

export type { RoomHomeRouteParams };
export default Room;
