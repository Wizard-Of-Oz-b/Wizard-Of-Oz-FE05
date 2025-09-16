import React from "react";
import ErrorPage from "./ErrorPage";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // TODO: send to Sentry/LogRocket etc.
    if (this.props.onCatch) this.props.onCatch(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          status={500}
          title="앗, 페이지를 불러오지 못했어요"
          message="예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다."
          actions={["home", "back", "support"]}
        />
      );
    }
    return this.props.children;
  }
}