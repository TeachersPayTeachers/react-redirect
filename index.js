'use strict';

var React = require('react'),
    createSideEffect = require('react-side-effect');

var _serverRedirect = null;

function getRedirectFromPropsList(propsList) {
    var innermostProps = propsList[propsList.length - 1];
    if (innermostProps) {
        return { location: innermostProps.location,
                 isPermanent: innermostProps.isPermanent
               };
    }
}

var WindowRedirect = createSideEffect(function handleChange(propsList) {
    var props = getRedirectFromPropsList(propsList);
    var location = props.location;
    props.isPermanent = props.isPermanent || true;

    if (typeof document !== 'undefined') {
        if (location)
            window.location = location;
    } else {
        _serverRedirect = props || null;
    }
}, {
    displayName: 'WindowRedirect',

    propTypes: {
        location: React.PropTypes.string.isRequired,
        isPermanent: React.PropTypes.bool
    },

    statics: {
        peek: function () {
            return _serverRedirect;
        },

        rewind: function () {
            var location = _serverRedirect;
            this.dispose();
            return location;
        }
    }
});

module.exports = WindowRedirect;
