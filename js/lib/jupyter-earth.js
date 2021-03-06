var widgets = require('@jupyter-widgets/base');
var _ = require('underscore');
var E = require('./libs/earth/1.0.0/earth.js');

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var EarthModel = widgets.DOMWidgetModel.extend({
    //defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    defaults: _.extend({}, widgets.WidgetModel.prototype.defaults, {

        _model_name : 'EarthModel',
        _view_name : 'EarthView',
        _model_module : 'ipyearth',
        _view_module : 'ipyearth',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        width : "100%",
        height : "600px",
    })
});


// Custom View. Renders the widget model.
var EarthView = widgets.DOMWidgetView.extend({
    render: function() {
        this.el.style['width'] = this.model.get('width');
        this.el.style['height'] = this.model.get('height');
        this.model.on('change:projection', this.projection_changed, this);
        this.model.on('change:topology', this.topology_changed, this);
        this.model.on('change:animate', this.animate_changed, this);
        this.model.on('change:vector_show', this.vector_show_changed, this);
        this.model.on('change:overlay', this.overlay_changed, this);
        this.model.on('change:overlayType', this.overlayType_changed, this);
        this.model.on('change:param', this.param_changed, this);
        this.model.on('change:color_map', this.color_map_changed, this);
        this.model.on('change:color_vmin', this.color_vmin_changed, this);
        this.model.on('change:color_vmax', this.color_vmax_changed, this);
        this.model.on('change:particleVelocityScale', this.particleVelocityScale_changed, this);
        this.model.on('change:particleMaxIntensity', this.particleMaxIntensity_changed, this);
        this.displayed.then(_.bind(this.render_earth, this));
    },

    projection_changed: function() {
        this.obj.configuration.save({projection: this.model.get('projection')});
    },

    topology_changed: function() {
        this.obj.configuration.save({topology: JSON.parse(this.model.get('topology'))});
    },

    animate_changed: function() {
        this.obj.configuration.save({vector_data: JSON.parse(this.model.get('animate'))});
    },

    vector_show_changed: function() {
        this.obj.configuration.save({vector_show: JSON.parse(this.model.get('vector_show'))});
    },

    overlay_changed: function() {
        this.obj.configuration.save({scalar_data: JSON.parse(this.model.get('overlay'))});
    },

    overlayType_changed: function() {
        this.obj.configuration.save({overlayType: this.model.get('overlayType')});
    },

    param_changed: function() {
        var param = this.model.get('param');
        this.obj.configuration.save({param: param});
    },

    color_map_changed: function() {
        this.obj.configuration.save({color_map: this.model.get('color_map')});
    },

    color_vmin_changed: function() {
        this.obj.configuration.save({color_vmin: this.model.get('color_vmin')});
    },

    color_vmax_changed: function() {
        this.obj.configuration.save({color_vmax: this.model.get('color_vmax')});
    },

    particleVelocityScale_changed: function() {
        this.obj.configuration.save({particleVelocityScale: this.model.get('particleVelocityScale')});
    },

    particleMaxIntensity_changed: function() {
        this.obj.configuration.save({particleMaxIntensity: this.model.get('particleMaxIntensity')});
    },

    render_earth: function () {
        this.create_obj();
        this.earth_events();
        return this;
    },

    create_obj: function () {
        this.obj = E.map(this.el);
    },

    earth_events: function () {
        var that = this;
        this.obj.configuration.on('change:coord', function () {
            var c = that.obj.configuration;
            that.model.set('_coord', c.get("coord"));
            that.touch();
        });
    }

});


module.exports = {
    EarthModel : EarthModel,
    EarthView : EarthView
};
