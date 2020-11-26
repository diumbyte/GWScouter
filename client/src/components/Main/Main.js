import './Main.css';

const Main = (props) => {
    return (
        <main className="main-wrapper">
            <div className="container main-content">
                {props.children}
            </div>
        </main>
    );
};

export default Main;