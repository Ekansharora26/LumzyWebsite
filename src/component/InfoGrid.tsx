"use client";

import React from "react";

const infoData = [
  { label: "CURRENTLY", value: "DEVELOPMENT HEAD AT NOVABITZ" },
  { label: "FREELANCER", value: "ANFISIGN & OTHERS" },
  { label: "SPECIALIZED AT", value: "UI/UX, DEVELOPMENT & BRANDING" },
  { label: "EMPOWERING", value: "WEBSITE DEVELOPMENT" },
  { label: "ENTHUSIASTIC BY", value: "DIGITAL, ART & TECHNOLOGY" },
  { label: "FROM", value: "UK, ENGLAND" },
];

export default function InfoGrid() {
  return (
    <div className="infoGrid">
      <div className="container">
        <div className="infoGrid_wrapper">
          {infoData.map((item, index) => (
            <div key={index} className="infoGrid_col">
              <p className="label">{item.label}</p>
              <p className="value">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
