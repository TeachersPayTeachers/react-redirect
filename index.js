'use strict';

var React = require('react'),
    createSideEffect = require('react-side-effect');

var _serverRedirect = null;

function getRedirectFromPropsList(propsList) {
    var innermostProps = propsList[propsList.length - 1];
    if (innermostProps) {
        return {
            location: innermostProps.location,
            isPermanent: innermostProps.isPermanent
        };
    }
}

var WindowRedirect = createSideEffect(function handleChange(propsList) {
    var props = getRedirectFromPropsList(propsList);

    if (typeof document !== 'undefined') {
        if (props && props.location)
            window.location = props.location;
    } else {
        if (props) {
            props.isPermanent = typeof props.isPermanent === 'boolean' ? props.isPermanent : true;
        }
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
            var props = _serverRedirect;
            this.dispose();
            return props;
        }
    }
});

module.exports = WindowRedirect;
