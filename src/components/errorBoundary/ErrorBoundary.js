import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo)
        this.setState({error: true})
    }

    render() {
        if (this.state.error) {//если есть ошибка, то выводим запасной интерфейс
            return <ErrorMessage/>
        }

        return this.props.children//если ошибки нет, то рендерим то, что находится внутри дочернего компонента
    }
}

export default ErrorBoundary