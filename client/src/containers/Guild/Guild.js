import { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
            userId: 0,
            guildName: '',
            userIsGuildAdmin: false,
            guildMembers: [],
            guildInviteLink: ''
        }
    }

    componentDidMount = async () => {
        const { data} = await axios.get('/api/guild');
        console.log("test");

        if(data.error) {
            this.props.history.push('/NoGuild');
            return;
        }

        const {
            userId, guildName, invite, usersInGuild, userIsGuildAdmin
        } = data;

        this.setState({
            userId,
            guildName,
            userIsGuildAdmin,
            guildMembers: usersInGuild, 
            guildInviteLink: `${process.env.PUBLIC_URL}/Guild/Join/${invite}`
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

        this.setState({guildInviteLink: `${process.env.PUBLIC_URL}/Guild/Join/${newInviteCode}`});
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
        const { userId, userIsGuildAdmin } = this.state;
        return this.state.guildMembers.map((item, idx) => {
            return (
                <Tr key={idx}>
                    <Td>{`${item.username}`}</Td>
                    { !userIsGuildAdmin
                        ? <></>
                        :
                            <Td>
                                {   userId === item.userId
                                    ? <></>
                                    : 
                                    <img 
                                        src={RemoveIcon} 
                                        alt="Remove member from guild icon"
                                        className="svg-icon"
                                        onClick={() => this.onRemoveMember(item.userId)}
                                    />
                                }
                            </Td>
                    }
                </Tr>
            );
        });
    }
    
    render() {
        const { guildName, userIsGuildAdmin } = this.state;
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
                            style={!userIsGuildAdmin ? {display: 'none'} : {}}
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
                            { !userIsGuildAdmin 
                                ? <></> 
                                : <Th className="remove">Remove</Th>
                            }
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

export default withRouter(Guild);