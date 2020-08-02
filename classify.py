import cv2
import os
import wget
import edgeiq
from edgeiq import edge_tools

"""
Use image classification to classify a batch of images. The
classification labels can be changed by selecting different models.
Different images can be used by updating the files in the *images/*
directory. Note that when developing for a remote device, removing
images in the local *images/* directory won't remove images from the
device. They can be removed using the `aai app shell` command and
deleting them from the *images/* directory on the remote device.

To change the computer vision model, follow this guide:
https://dashboard.alwaysai.co/docs/application_development/changing_the_model.html

To change the engine and accelerator, follow this guide:
https://dashboard.alwaysai.co/docs/application_development/changing_the_engine_and_accelerator.html
"""


class Classify:

    def __init__(self):
        self.classifier = edgeiq.Classification("alwaysai/googlenet")
        self.classifier.load(engine=edgeiq.Engine.DNN)
        self.imgs_path = "./images/"

        print("Engine: {}".format(self.classifier.engine))
        print("Accelerator: {}\n".format(self.classifier.accelerator))
        print("Model:\n{}\n".format(self.classifier.model_id))
        print("Labels:\n{}\n".format(self.classifier.labels))

    def classify(self, url):
        #   image_paths = sorted(list(edgeiq.list_images("images/")))
        #   print("Images:\n{}\n".format(image_paths))
        #   download image from url using wget
        img = wget.download(url, out=self.imgs_path)
        image_display = cv2.imread(img)
        image = image_display.copy()
        results = self.classifier.classify_image(image)
        os.remove(self.imgs_path+img)
        #   generate a bool (True if nsfw, False if not, None if error)

        if results.predictions:
            for idx, prediction in enumerate(results.predictions[:5]):
                if prediction.label == "Not Safe For Work":
                    return True
            return False
        return None


if __name__ == "__main__":
    nn = Classify()
    print(nn.classify(input("Classify a file:")))