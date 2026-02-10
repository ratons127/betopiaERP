from __future__ import annotations

import ipaddress
import socket
import urllib.parse
from typing import Iterable

import requests


def _is_public_ip(ip: str) -> bool:
    try:
        return ipaddress.ip_address(ip).is_global
    except ValueError:
        return False


def _iter_host_ips(host: str) -> Iterable[str]:
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror:
        return []
    return [info[4][0] for info in infos]


def is_public_url(url: str, *, allowed_schemes: Iterable[str] = ("http", "https")) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
    except ValueError:
        return False
    if parsed.scheme not in allowed_schemes:
        return False
    host = parsed.hostname
    if not host:
        return False
    if host == "localhost" or host.endswith(".localhost"):
        return False

    if _is_public_ip(host):
        return True
    if _is_public_ip(host) is False:
        # host might be a hostname; resolve and validate all results
        ips = _iter_host_ips(host)
        if not ips:
            return False
        return all(_is_public_ip(ip) for ip in ips)
    return False


def fetch_url_content(
    url: str,
    *,
    timeout: float,
    max_bytes: int,
    headers: dict | None = None,
    allow_redirects: bool = False,
    validate_redirects: bool = True,
) -> bytes:
    if not is_public_url(url):
        raise ValueError("URL is not allowed")

    response = requests.get(
        url,
        timeout=timeout,
        headers=headers,
        allow_redirects=allow_redirects,
        stream=True,
    )
    response.raise_for_status()

    if validate_redirects and response.url and response.url != url:
        if not is_public_url(response.url):
            raise ValueError("Redirected URL is not allowed")

    content = bytearray()
    for chunk in response.iter_content(chunk_size=8192):
        if not chunk:
            continue
        content.extend(chunk)
        if len(content) > max_bytes:
            raise ValueError("Response too large")
    return bytes(content)
