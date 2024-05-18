export default defineEventHandler(async (event) => {
  const { roomCode } = getQuery(event);
  const { users } = await getUsers(roomCode as string);

  return {
    users,
  };
});
