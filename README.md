**MMVC**

* **Concept**
Mini MVC is a micro Javascript library for an easy implementation of MVC architecture.

* **Utilisation**
You can make any Javascript Object a model of mmvc, and give a list of observable variables.
These variables can then be observed by a Callback object which can simulate a function invokation environment of an object.

* **Example**
```javascript
    var view = {
        y : 0
        levelChanged: function(value) {
            this.y = value;
        }
    }
    var model = {
        level : 0
    }
    mmvc.makeModel(model, ['a']);
    var levelChangedCallback = new Callback(view.levelChanged, view);
    model.observe('a', levelChangedCallback);
    model.setlevel(3);
    // Now view.y equals to 3 too
```