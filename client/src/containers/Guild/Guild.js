import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './Guild.css'
import CopyIcon from '../../assets/content-copy.svg';
import RefreshIcon from '../../assets/refresh.svg';
import RemoveIcon from '../../assets/minus-circle.svg';
import PencilIcon from '../../assets/pencil-edit.svg'
import axios from 'axios';
import { toast } from 'react-toastify';
import GuildEdit from '../GuildEdit/GuildEdit';

class Guild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            guildId: 0,
            guildName: '',
            userIsGuildAdmin: false,
            guildMembers: [],
            guildInviteLink: '',
            openModal: false,
        }
    }

    componentDidMount = async () => {
        let data;
        try {
            const res = await axios.get('/api/guild');
            data = res.data;
        } catch (err) {
            const { data } = err.response;

            data.errors.forEach(err => toast.error(`${err.msg}`))
            return this.props.history.push('/NoGuild');
        }

        const {
            userId, guildName, invite, usersInGuild, userIsGuildAdmin, guildId
        } = data;

        
        usersInGuild.sort((firstEle, secondEle) => {
            // Put admins first
            if (firstEle.isAdmin && !secondEle.isAdmin) {
                return -1;
            } else if (!firstEle.isAdmin && secondEle.isAdmin) {
                return 1;
            } else { // They're either both admin or both not admin
                if(firstEle.username > secondEle.username) {
                    return 1;
                } else if (firstEle.username < secondEle.username) {
                    return -1;
                } else {
                    return 0;
                }
            }
            // Regular members last
        });
        
        // Put self at beginning of list
        const selfElement = usersInGuild.splice(usersInGuild.findIndex(i => i.userId === userId), 1);
        usersInGuild.unshift(selfElement[0]);
        
        this.setState({
            userId,
            guildId, 
            guildName,
            userIsGuildAdmin,
            guildMembers: usersInGuild, 
            guildInviteLink: `${window.location.host}/Guild/Join/${invite}`
        });
    }

    onCopyInviteLink = () => {
        const { guildInviteLink } = this.state;

        navigator.clipboard.writeText(`https://${guildInviteLink}`);
    }

    onRefreshInviteLink = async () => {
        let data;
        try {
            const res = await axios.post('/api/guild/invite');
            data = res.data;
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }

        const newInviteCode = data;

        this.setState({guildInviteLink: `${window.location.host}/Guild/Join/${newInviteCode}`});
    }

    onEditMember = (idx) => async (e) => {
        const { guildMembers, guildId } = this.state;
        const [...guildMembersCopy] = guildMembers;
        const { userId, isAdmin, username} = guildMembers[idx];

        if(this.isActionOnSelf(this.state.userId, userId)) return;


        try {
            await axios.post(`/api/guild/user/${userId}`, {
                newIsAdmin: !isAdmin,
                guildId
            });
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }
        
        guildMembersCopy[idx] = {
            userId,
            isAdmin: !isAdmin,
            username
        }

        this.setState({
            guildMembers: guildMembersCopy
        })
    }

    onRemoveMember = async (userId) => {
        if(this.isActionOnSelf(this.state.userId, userId)) return;
        
        const listWithoutRemovedMember = this.state.guildMembers.filter(mbr => mbr.userId !== userId);
        
        try {
            await axios.delete(`/api/guild/user/${userId}`);
        } catch(err) {
            const { data } = err.response;

            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }

        this.setState({
            guildMembers: listWithoutRemovedMember
        })

    }

    isActionOnSelf = (userId, memberId) => {
        if(userId === memberId) {
            toast.warn("You cannot perform this action on yourself.");
        }

        return userId === memberId;
    }

    buildTableData = () => {
        const { userIsGuildAdmin, guildMembers } = this.state;
        return guildMembers.map((item, idx) => {
            return (
                <tr key={idx}>
                    <td><span className="guild-member">{`${item.username}`}</span></td>
                    { !userIsGuildAdmin
                        ? <></>
                        :
                            <>
                            <td>
                                    <input 
                                        type="checkbox" 
                                        checked={guildMembers[idx].isAdmin}
                                        value={guildMembers[idx].isAdmin}
                                        onChange={this.onEditMember(idx)}
                                    />
                                {/* {   userId === item.userId
                                    ? <span>&nbsp;</span>
                                    : 
                                    <input 
                                        type="checkbox" 
                                        checked={guildMembers[idx].isAdmin}
                                        value={guildMembers[idx].isAdmin}
                                        onChange={this.onEditMember(idx)}
                                    />

                                } */}
                            </td>
                            <td>
                                <img 
                                    src={RemoveIcon} 
                                    alt="Remove member from guild icon"
                                    className="svg-icon"
                                    onClick={() => this.onRemoveMember(item.userId)}
                                />
                                {/* {   userId === item.userId
                                    ? <span>&nbsp;</span>
                                    : 
                                    <img 
                                        src={RemoveIcon} 
                                        alt="Remove member from guild icon"
                                        className="svg-icon"
                                        onClick={() => this.onRemoveMember(item.userId)}
                                    />
                                } */}
                            </td>
                            </>
                    }
                </tr>
            );
        });
    }

    onOpenModal = () => {this.setState({openModal: true})}
    onCloseModal = () => {this.setState({openModal: false})}
    onGuildEdit = (newName) => {this.setState({guildName: newName})}
    
    render() {
        const { guildName, userIsGuildAdmin } = this.state;
        return (
            <>
                <div className="guild-container">
                    <h2 className="guild-name">
                    { userIsGuildAdmin 
                        ? <img 
                            src={PencilIcon} 
                            alt="Edit Guild Name" 
                            className="svg-icon"
                            onClick={this.onOpenModal}
                        />
                        : <></>
                    }
                    <span>{guildName}</span>
                    </h2>
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
                    <table>
                        <thead>
                            <tr>
                                <th className="username">Username</th>
                                { !userIsGuildAdmin 
                                    ? <></> 
                                    :
                                        <>
                                        <th className="edit">Is Admin?</th>
                                        <th className="remove">Remove</th>
                                        </>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {this.buildTableData()}
                        </tbody>
                    </table>
                </div>
                <Modal open={this.state.openModal} onClose={this.onCloseModal} classNames={{modal: 'customModal'}}>
                    <GuildEdit 
                        guildId={this.state.guildId}
                        guildName={guildName}
                        onCloseModal={this.onCloseModal}
                        onGuildEdit={this.onGuildEdit}
                    />
                </Modal>
            </>
        );
    }
}

export default withRouter(Guild);