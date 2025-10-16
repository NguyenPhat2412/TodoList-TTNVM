import { Button, Result } from "antd";

const ErrorPage = () => {
  return (
    <div>
      <Result
        status="error"
        title="Error"
        subTitle="Something went wrong."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  );
};

export default ErrorPage;
