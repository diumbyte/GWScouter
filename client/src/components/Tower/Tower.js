import React, { Component } from 'react';
import Unit from '../Unit/Unit';
import HistoryIcon from '../../assets/history.svg';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import TowerHistory from '../TowerHistory/TowerHistory';
// import NotesIcon from '../../assets/note-multiple.svg';
import './Tower.css';

class Tower extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false
        }

        const { towerData : { towerId } } = this.props;
        this[`tower${towerId}Ref`] = React.createRef();
    }

    componentDidMount() {
        const hash = parseInt(window.location.hash.substr(1));
        const { towerData : { towerId } } = this.props;

        // console.log(this);
        if(hash && hash === towerId) {
            setTimeout( () => {
                this[`tower${towerId}Ref`].current.scrollIntoView({ 
                    behavior: 'smooth'
                });
            }, 0);
        }
    }

    buildTowerItem = (isTeamOne) => {
        const {towerData} = this.props;

        const filteredUnits = isTeamOne
            ? towerData.teamOne
            : towerData.teamTwo

        return (
            <>
                {filteredUnits.map(unit => 
                    <Unit 
                        key={unit.id} 
                        {...unit} 
                    />
                )}
            </>
        );
    }

    onOpenModal = () => {this.setState({openModal: true})}
    onCloseModal = () => {this.setState({openModal: false})}

    render() {
        const { towerData } = this.props;
        const { openModal } = this.state;
        return (
            <div className="tower" id={towerData.towerId} ref={this[`tower${towerData.towerId}Ref`]}>
                <div className="tower-data-name towers-name-width">
                    <p>{towerData.username}</p>
                    <div className="tower-data-action">
                            <img 
                                className="svg-icon" 
                                src={HistoryIcon} 
                                alt="Tower history button"
                                onClick={this.onOpenModal}
                            />
                        {/* <img className="svg-icon" src={NotesIcon} alt="Notes button"/> */}
                    </div>
                </div>
                <div className="tower-data-teams-container">
                    <div className="tower-data-team tower-team-one towers-team-width">
                        {this.buildTowerItem(true)}
                    </div>
                    <div className="tower-data-team tower-team-two towers-team-width">
                        {this.buildTowerItem(false)}
                    </div>
                </div>
                <Modal open={openModal} onClose={this.onCloseModal} classNames={{modal: 'customModal'}}>
                    <TowerHistory towerId={`${towerData.towerId}`}/>
                </Modal>
            </div>
        );
    }
}

export default Tower;