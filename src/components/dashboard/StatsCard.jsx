import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ icon, title, value, change, changeText, iconBgColor, iconColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`inline-flex rounded-full ${iconBgColor} ${iconColor} p-3`}>
        <i className={`fas fa-${icon} text-xl`}></i>
      </div>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {(change || changeText) && (
        <p className="text-sm text-gray-500">
          {change && `${change} `}{changeText}
        </p>
      )}
    </div>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string,
  changeText: PropTypes.string,
  iconBgColor: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired
};

export default StatsCard;