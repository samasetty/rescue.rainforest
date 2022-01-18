import React, { useState, useEffect } from "react";
import "./EntryPage.css";
import { Link } from "@reach/router";
import Checkbox from "../modules/Checkbox.js";

const EntryPage4 = (props) => {
    /*useEffect(() => {
        console.log(sessionStorage.getItem('slider'));
    }, []);*/
    const [servings, setServings] = useState({})
    const serv = (type, servs) => {
        servings[type] = servs;
    };

    const map = {"meat":7.6, "beef":50, "lamb":20, "pork":7.6, "poultry":5.7, "dairy":6.1, 
                    "non":0.7, "rice":1.2, "soy":1, "oat":0.9, "almond":0.7};
    
    const localMap = {"meat":4.6, "beef":20, "lamb":12, "pork":4.6, "poultry":2.4, "dairy":3.1, 
                    "non":0.7, "rice":1.2, "soy":1, "oat":0.9, "almond":0.7};

    const defaultVal = {"meat":2, "beef":1, "lamb":1, "pork":1, "poultry":1, "dairy":2, 
                    "non":0.25, "rice":1, "soy":1, "oat":1, "almond":1};

    const ozTog = 28.3495;
    const gPerServ = 3 * ozTog;
    const convFactor = gPerServ / 100;

    const handleClick = () => {
        for (const [key, value] of Object.entries(servings)) {
            sessionStorage.setItem(key, value);
        }
        for (let i = 0; i < sessionStorage.length; i++) {
            console.log(JSON.stringify(sessionStorage.key(i)) + ", " + sessionStorage.getItem(sessionStorage.key(i)));
        }
    }

    const handleRightArrowHover = () => {
        document.querySelector('.RightArrow').animate([
            {left: '0'},
            {left: '10px'},
            {left: '0'}
        ],{
            duration: 700,
            iterations: 2
        });
    }

    const handleLeftArrowHover = () => {
        document.querySelector('.LeftArrow').animate([
            {left: '0'},
            {left: '10px'},
            {left: '0'}
        ],{
            duration: 700,
            iterations: 2
        });
    }

    const handleSubmit = () => {
        // calculate score
        let carbonScore = 0;

        // first look at locally produced
        if (!sessionStorage.getItem("local")) { let localPercent = defaultVal["local"]; }
        else { let localPercent = sessionStorage.getItem("local"); }
        let normPercent = 1 - localPercent;

        // next, look at meat
        if (!sessionStorage.getItem("beef") && !sessionStorage.getItem("lamb") &&
                !sessionStorage.getItem("pork") && !sessionStorage.getItem("poultry")) {
            
            if (!sessionStorage.getItem("meat")) {
                carbonScore += normPercent * map["meat"] * defaultVal["meat"] + localPercent * localMap["meat"] * defaultVal["meat"];
            } else {
                carbonScore += normPercent * map["meat"] * sessionStorage.getItem("meat") + localPercent * localMap["meat"] * sessionStorage.getItem("meat");
            }
        } else {
            let meatList = ["beef", "lamb", "pork", "poultry"];
            for (const meat of meatList) {
                if (sessionStorage.getItem(meat)) {
                    carbonScore += normPercent * map[meat] * sessionStorage.getItem(meat) + localPercent * localMap[meat] * sessionStorage.getItem(meat);
                } else {
                    carbonScore += normPercent * map[meat] * defaultVal[meat] + localPercent * localMap[meat] * defaultVal[meat];
                }
            }
        }

        // look at dairy
        if (sessionStorage.getItem("dairy")) {
            carbonScore += normPercent * map["dairy"] * sessionStorage.getItem("dairy") + localPercent * localMap["dairy"] * sessionStorage.getItem("dairy");
        } else {
            carbonScore += normPercent * map["dairy"] * defaultVal["dairy"] + localPercent * localMap["dairy"] * defaultVal["dairy"];
        }

        // look at vegan alternatives
        if (!sessionStorage.getItem("rice") && !sessionStorage.getItem("soy") &&
                !sessionStorage.getItem("oat") && !sessionStorage.getItem("almond")) {
            
            if (!sessionStorage.getItem("non")) {
                carbonScore += normPercent * map["non"] * defaultVal["non"] + localPercent * localMap["non"] * defaultVal["non"];
            } else {
                carbonScore += normPercent * map["non"] * sessionStorage.getItem("non") + localPercent * localMap["non"] * sessionStorage.getItem("non");
            }
        } else {
            let altList = ["rice", "soy", "oat", "almond"];
            for (const alt of altList) {
                if (sessionStorage.getItem(alt)) {
                    carbonScore += normPercent * map[alt] * sessionStorage.getItem(alt) + localPercent * localMap[alt] * sessionStorage.getItem(alt);
                } else {
                    carbonScore += normPercent * map[alt] * defaultVal[alt] + localPercent * localMap[alt] * defaultVal[alt];
                }
            }
        }

        // conversion
        carbonScore *= convFactor;

        // look at acai, etc.
        let consList = ["acai", "cocoa", "nuts", "gua"];
        for (const item of consList) {
            if (sessionStorage.getItem(alt) && sessionStorage.getItem(alt) === true) {
                carbonScore -= 5;
            }
        }

        // finished! time to post.
        let val = Number(carbonScore);
        const body = {score: val, creator_id: props.userId, creator_name: "filler"};
        post("/api/entry", body).then((entry) => {
            props.addNewEntry(entry);
        });
    }

    return (
        <>
            <h6 className="EntryPageHeader">CONSERVE THE AMAZON</h6>
            <h2 className="EntryPageQuestion">How many of these foods did you eat?</h2>
            
            <Checkbox text="Açaí berries" id="acai" save={serv} servs = {servings} />
            <br />
            <Checkbox text="Amazonian cocoa" id="cocoa" save={serv} servs = {servings} />
            <br />
            <Checkbox text="Brazil nuts" id="nuts" save={serv} servs = {servings} />
            <br />
            <Checkbox text="Guaraná berries" id="gua" save={serv} servs = {servings} />
            <br />

            <Link to="/Journey" className="SubmitButton" 
                onClick = {handleSubmit}> Submit
            </Link>

            <Link to="/entry/3" className="LeftArrowContainer" 
                onMouseOver = { handleLeftArrowHover } 
                onClick = {handleClick} >
                <div className="LeftArrow" />
            </Link>
            
        </> 
    );
};

export default EntryPage4;