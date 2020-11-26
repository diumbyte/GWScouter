import { Component } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import './Guild.css'
import CopyIcon from '../../assets/content-copy.svg';
import RefreshIcon from '../../assets/refresh.svg';
import RemoveIcon from '../../assets/minus-circle.svg';

class Guild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guildMembers: [],
            guildInviteLink: ''
        }
    }

    componentDidMount() {
        // TODO: API call for guild members
        const updatedList = [
            {
                username: 'usernameOne',
                userId: 1
            },
            {
                username: 'usernameTwo',
                userId: 2
            },
            {
                username: 'usernameThree',
                userId: 3
            },
        ]

        const guildInviteLink = `${process.env.PUBLIC_URL}/${'HGaXgRDX'}`;

        this.setState({guildMembers: updatedList, guildInviteLink: guildInviteLink});
    }

    onCopyInviteLink = () => {
        const { guildInviteLink } = this.state;

        navigator.clipboard.writeText(guildInviteLink);
    }

    onRefreshInviteLink = () => {
        // TODO: API call to refresh guild invite link

        const newInviteCode = "qMnaptA";
        this.setState({guildInviteLink: `${process.env.PUBLIC_URL}/${newInviteCode}`});
    }

    onRemoveMember = (userId) => {
        const listWithoutRemovedMember = this.state.guildMembers.filter(mbr => mbr.userId !== userId);

        this.setState({
            guildMembers: listWithoutRemovedMember
        })

        // TODO: API call to remove member from DB
    }

    buildTableData = () => {
        return this.state.guildMembers.map((item, idx) => {
            return (
                <Tr key={idx}>
                    <Td>{`${item.username}`}</Td>
                    <Td>
                        <img 
                            src={RemoveIcon} 
                            alt="Remove member from guild icon"
                            className="svg-icon"
                            onClick={() => this.onRemoveMember(item.userId)}
                        />
                    </Td>
                </Tr>
            );
        });
    }
    
    render() {
        return (
            <div className="guild-container">
                <h2>Guild</h2>
                <div className="invite-container">
                    <p className="invite-text">{this.state.guildInviteLink}</p>
                    <div className="invite-icons">
                        <img 
                            src={CopyIcon} 
                            className="svg-icon" 
                            alt="Copy invite link icon"
                            onClick={this.onCopyInviteLink}
                        />
                        <img 
                            src={RefreshIcon} 
                            className="svg-icon" 
                            alt="Refresh invite link icon"
                        />
                    </div>
                </div>
                <Table>
                    <Thead>
                        <Tr>
                            <Th className="username">Username</Th>
                            <Th className="remove">Remove</Th>
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

export default Guild;