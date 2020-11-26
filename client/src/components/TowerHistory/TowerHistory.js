import { Component } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import './TowerHistory.css'

//TODO: Need to figure out how to deal with Time/Date stuff
class TowerHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyList: []
        }
    }

    componentDidMount() {
        //TODO: API call for specific towerId
        const updatedList = [
            {
                username: "userOne",
                time: "12:00",
                change: "Created tower"
            },
            {
                username: "userTwo",
                time: "1:30",
                change: "Edited Arbiter Vildred speed to 222"
            },
            {
                username: "userThree",
                time: "2:00",
                change: "Edited Arbiter Vildred artifact to Moonlight Dreamblade"
            }
        ];

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
        const {towerId} = this.props;
        
        return (
            <div className="tower-history-container">
                <h2>Tower History WIP - {`${towerId}`}</h2>
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