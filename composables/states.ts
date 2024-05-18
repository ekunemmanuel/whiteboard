export const useTool = () =>
  useState("tool", () => ({
    width: 2,
    color: "#000000",
    isEraserSelected: false
  }));
