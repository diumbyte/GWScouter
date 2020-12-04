import { Component } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import './TowerHistory.css'
import axios from 'axios';
import { zonedTimeToUtc, format } from 'date-fns-tz';

//TODO: Need to figure out how to deal with Time/Date stuff
class TowerHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            historyList: []
        }
    }

    componentDidMount = async () => {
        const { towerId } = this.props;

        let res;
        try {
            res = await axios.get(`/api/tower/history/${towerId}`);
        } catch(err) {
            const { data, status } = err.response;
            this.setState({errorMessage: `Error ${status}: ${data}`});
            return;
        }

        const updatedList = res.data.map(entry => {
            const utcDate = zonedTimeToUtc(entry.updated_at);
            const pattern = 'HH:mm zzz';
            const timeOutput = format(utcDate, pattern);
            return {
                username: entry.username,
                time: timeOutput,
                change: entry.action
            }
        });

        this.setState({historyList: updatedList});
    }

    buildTableData = () => {
        return this.state.historyList.map((item, idx) => {
            return (
                <Tr key={idx}>
                    <Td>{`${item.username}`}</Td>
                    <Td>{`${item.time}`}</Td>
                    <Td>{`${item.change}`}</Td>
                </Tr>
            )
        });
    }

    render() {
        return (
            <div className="tower-history-container">
                <h2>Tower History</h2>
                <Table>
                    <Thead>
                        <Tr>
                            <Th className="username">User</Th>
                            <Th className="timestamp">Time</Th>
                            <Th className="change">Change</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {this.buildTableData()}
                    </Tbody>
                </Table>
            </div>
        );
    }
}

export default TowerHistory;