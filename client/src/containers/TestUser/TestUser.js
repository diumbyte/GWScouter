import { Component } from 'react';
import axios from 'axios';

export default class TestUser extends Component {
    componentDidMount = async () => {
        await axios.get('/auth/test_account_login');


        window.location.href = '/Battle/Top';
    }

    render() {
        return (
            <div></div>
        );
    }
}