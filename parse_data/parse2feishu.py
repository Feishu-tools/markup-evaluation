import base64
import feishu_sdk
from feishu_sdk.sheet import FeishuAttachment, FeishuSheet, FeishuImage
import asyncio
from PIL import Image
import io
import os
import traceback
import json
import datetime
import string
import time
import requests
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading


def download_info():
    # https://gaotuedu.feishu.cn/sheets/Kb0nsE73ghiwivtXegQcDMUZnNb?sheet=Gxv7iS
    # https://gaotuedu.feishu.cn/sheets/Kb0nsE73ghiwivtXegQcDMUZnNb?sheet=Gxv7iS
    feishu_sdk.login("cli_a801922b07325013", "saBeFOLLaEay7Z2wDgtwxfl46RYfWNEs")
    sheet_token, sheet_id = "Kb0nsE73ghiwivtXegQcDMUZnNb", "Gxv7iS"
    sheet = FeishuSheet(sheet_token, sheet_id)

    # https://gaotuedu.feishu.cn/sheets/Kb0nsE73ghiwivtXegQcDMUZnNb?sheet=Wo7QrQ
    write_sheet_token, write_sheet_id = "Kb0nsE73ghiwivtXegQcDMUZnNb", "Gxv7iS"
    write_sheet = FeishuSheet(write_sheet_token, write_sheet_id)

    all_info = []
    idx = 3
    for i in range(1, min(sheet.rows+1, 264)):
        if i < 3:
            continue
        # if i in [2, 217]:
        #     continue
        if not sheet[f"G{i}"]:
            continue
        _id = sheet[f"A{i}"]
        print(i)
        data = json.loads("".join([i["text"] for i in sheet[f"G{i}"]]))
        for info in data["grading_report"]:
            if idx < 3:
                idx += 1
                continue
            # write_sheet[f"A{idx}":f"M{idx}"] = [[
            #     sheet[f"A{i}"],
            #     sheet[f"B{i}"],
            #     info.get("image", ""),
            #     str(info["actual_is_correct"]),
            #     info["actual_question_type"],
            #     str(info.get("isAdded", "")),
            #     info.get("question_text", ""),
            #     info["question_number"],
            #     "正确" if info["is_correct"] else "错误",
            #     info["question_type"],
            #     info["analysis"],
            #     json.dumps(info.get("steps", []), ensure_ascii=False, indent=4),
            #     info["analysis_acceptability"]
            # ]]
            write_sheet[f"N{idx}"] = json.dumps(data, ensure_ascii=False, indent=4)
    #         all_info.append([json.dumps(info, ensure_ascii=False, indent=4)])
            idx += 1
    # print(len(all_info)+3)
    # # print(all_info)
    # write_sheet[f"N3":f"N{len(all_info)+2}"] = [all_info]
    # # write_sheet[f"N3":f"N4"] = [[1], [2]]
        
        # break

def post(text, image_url):
    url = "http://10.195.0.3:12346/text-grounding"
    data = {
        "text": text,
        "image_url": image_url
    }

    response = requests.post(url, json=data)
    return response.json()["data"]["location"]


def download_info1():
    # https://gaotuedu.feishu.cn/sheets/Kb0nsE73ghiwivtXegQcDMUZnNb?sheet=Gxv7iS
    # https://gaotuedu.feishu.cn/sheets/Kb0nsE73ghiwivtXegQcDMUZnNb?sheet=Gxv7iS
    feishu_sdk.login("cli_a801922b07325013", "saBeFOLLaEay7Z2wDgtwxfl46RYfWNEs")
    sheet_token, sheet_id = "Kb0nsE73ghiwivtXegQcDMUZnNb", "Gxv7iS"
    sheet = FeishuSheet(sheet_token, sheet_id)

    # https://gaotuedu.feishu.cn/sheets/Kb0nsE73ghiwivtXegQcDMUZnNb?sheet=Wo7QrQ
    write_sheet_token, write_sheet_id = "Kb0nsE73ghiwivtXegQcDMUZnNb", "Gxv7iS"
    write_sheet = FeishuSheet(write_sheet_token, write_sheet_id)

    all_info = []
    idx = 3
    for i in range(1, min(sheet.rows+1, 264)):
        if i < 3:
            continue
        # if i in [2, 217]:
        #     continue
        if not sheet[f"G{i}"]:
            continue
        data = json.loads("".join([i["text"] for i in sheet[f"G{i}"]]))
        for info in data["grading_report"]:
            image_url = info.get("image", "")
            text = f'第"{info.get("question_number", "")}"题手写作答"{info.get("question_number", "")}"'
            location = post(text, image_url)
            info["location"] = location
            print(text, ":", location)

        write_sheet[f"M{i}"] = json.dumps(data, ensure_ascii=False, indent=4)

        
        # break

if __name__ == "__main__":
    download_info1()