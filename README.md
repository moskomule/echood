# échood

échood is an easy configuration tool for machine learning project.

## installation

échood uses Electron and currently `node.js` and `npm` is required.

```bash
git clone
npm start
```

## user guide

### sample input

```json
{
    /*default values*/
    "numerical": {
        "lr": 0.1,
        "beta": 0.99
    },
    /*first elements are default*/
    "single-choice": {
        "model": ["ResNet", "VGG"]
    },
    "multi-choice": {
        "augmentation": [["flip"], "crop"]
    }
}
```

### sample output

```json
{
    " 7492fae": {
        "lr": 0.01,
        "beta": 0.99,
        "model": "ResNet",
        "augmentation": ["flip"],
        "description": "best learning rate",
        "data": "2017-09-01",
    },
    "e00c647": {
        "lr": 0.1,
        "beta": 0.99,
        "model": "ResNet",
        "augmentation": ["flip", "crop"],
        "description": "use crop",
        "data": "2017-09-02",
    }
}
```

## why echood

This is my first Electron and javascript project, so that this is an étude() for me. Also I thought up this project when I traveled in Toyama prefecture, Japan, which was called Etchū(越中).

## todo

- [ ] check duplicated
