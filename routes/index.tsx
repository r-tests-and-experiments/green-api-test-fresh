import { define } from "../utils.ts";
import Form from "../islands/Form.tsx";

export default define.page(function Home(ctx) {
  ctx.state.title = "Green-API test Fresh";
  return <Form />;
});
