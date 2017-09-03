import ...

def main(model, optimizer):
    ...

if __name__ == "__main__":
    import argparse
    import json
    parser = argparse.ArgumentParser()
    parser.add_argument("id")
    args = parser.parse_args()

    with open("config/config.json") as f:
        setting = json.load(f)[args.id]

    train_image = ImageLoader(setting["augmentation"])
    model = load_model(setting["model"])
    optimizer = opt.Adagrad(lr=float(setting["lr"]), beta=float(setting["beta"]))
    main(model, optimizer)
