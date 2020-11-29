import { Component } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import './Guild.css'
import CopyIcon from '../../assets/content-copy.svg';
import RefreshIcon from '../../assets/refresh.svg';
import RemoveIcon from '../../assets/minus-circle.svg';
import axios from 'axios';

class Guild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guildName: '',
            userIsGuildAdmin: false,
            guildMembers: [],
            guildInviteLink: ''
        }
    }

    componentDidMount = async () => {
        const { data : {
            guildName, invite, usersInGuild, userIsGuildAdmin
        }} = await axios.get('/api/guild');

        this.setState({
            guildName,
            guildMembers: usersInGuild, 
            guildInviteLink: `${process.env.PUBLIC_URL}/${invite}`
        });
    }

    onCopyInviteLink = () => {
        const { guildInviteLink } = this.state;

        navigator.clipboard.writeText(guildInviteLink);
    }

    onRefreshInviteLink = async () => {
        // TODO: API call to refresh guild invite link
        const res = await axios.post('/api/guild/invite');

        const newInviteCode = res.data;

        this.setState({guildInviteLink: `${process.env.PUBLIC_URL}/${newInviteCode}`});
    }

    onRemoveMember = async (userId) => {
        const listWithoutRemovedMember = this.state.guildMembers.filter(mbr => mbr.userId !== userId);
        
        // TODO: API call to remove member from DB
        const { status } = await axios.post('/api/guild/user', {
            userId
        })

        if (status !== 200) {
            return;
        }

        this.setState({
            guildMembers: listWithoutRemovedMember
        })

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
        const { guildName } = this.state;
        return (
            <div className="guild-container">
                <h2 className="guild-name">{guildName}</h2>
                <h3>Invite Link:</h3>
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
                            onClick={this.onRefreshInviteLink}
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