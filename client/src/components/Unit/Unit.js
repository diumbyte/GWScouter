import {
    Link
} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import './Unit.css';
import ImmunityIcon from '../../assets/unit-icons/Immunity.webp';
import SpeedIcon from '../../assets/unit-icons/Speed.webp';
import HealthIcon from '../../assets/unit-icons/Health.webp';
import CounterIcon from '../../assets/unit-icons/Counter.webp';
import EditIcon from '../../assets/clipboard-edit.svg';

// TODO: Don't forget to extract unit image and artifact image to a variable as well.
// TODO: Use CSS class darken-image to indicate that a set is NOT active.
const Unit = (props) => {
        const {
            id,
            name,
            unitCode,
            speed,
            health,
            artifact,
            artifactCode,
            hasImmunity,
            hasCounter
        } = props;

        return (
            <>
            <div className="tower-data-team-unit">
                <img 
                    src={`${process.env.PUBLIC_URL}/assets/images/artifact/${artifactCode}.png`} 
                    className="team-unit-artifact" 
                    alt="Artifact preview" 
                    data-tip={`${artifact}`} 
                />
                <Link to={`/Battle/Unit/${id}`} >
                    <img src={EditIcon} className="edit-icon svg-icon" alt="Edit icon"/>
                </Link>
                <div className="team-unit-image">
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/images/hero/${unitCode}.png`}
                        className="source-image" 
                        alt="Unit preview"
                    />
                </div>
                <div className="team-unit-info">
                    <div className="team-unit-name">
                        <p>{name}</p>
                    </div>
                    <div className="team-unit-speed">
                        <img src={SpeedIcon} className="set-icon" alt="Speed icon"/>
                        <p>{speed}</p>
                    </div>
                    <div className="team-unit-health">
                        <img src={HealthIcon} className="set-icon" alt="Health icon"/>
                        <p>{health}</p>
                    </div>
                    <div className="team-unit-sets">
                            <img 
                                src={CounterIcon} 
                                className={!hasCounter ? "set-icon darken-image" : "set-icon"} 
                                alt="Counter set icon"/>
                            <img 
                                src={ImmunityIcon} 
                                className={!hasImmunity ? "set-icon darken-image" : "set-icon"} 
                                alt="Immunity set icon"/>
                    </div>
                </div>
            </div>
            <ReactTooltip />
            </>
        );
    }

export default Unit;