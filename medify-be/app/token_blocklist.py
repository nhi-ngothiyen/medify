# app/token_blocklist.py
from typing import Dict
import time
from threading import RLock

# In-memory blocklist: token -> exp_epoch
# Dùng lock để an toàn luồng khi chạy đa-worker dev.
_blocked: Dict[str, int] = {}
_lock = RLock()

def block(token: str, exp_epoch: int) -> None:
    with _lock:
        _blocked[token] = exp_epoch
        _cleanup()

def is_blocked(token: str) -> bool:
    now = int(time.time())
    with _lock:
        exp = _blocked.get(token)
        if exp is None:
            return False
        if exp <= now:
            # token đã hết hạn -> gỡ khỏi blocklist
            _blocked.pop(token, None)
            return False
        return True

def _cleanup() -> None:
    """Dọn các token đã hết hạn để tránh đầy bộ nhớ."""
    now = int(time.time())
    for t, exp in list(_blocked.items()):
        if exp <= now:
            _blocked.pop(t, None)
