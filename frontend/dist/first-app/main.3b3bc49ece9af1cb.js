"use strict";
(self.webpackChunkfirst_app = self.webpackChunkfirst_app || []).push([
  [179],
  {
    879: () => {
      function ur(n) {
        return "function" == typeof n;
      }
      let xs = !1;
      const Yt = {
        Promise: void 0,
        set useDeprecatedSynchronousErrorHandling(n) {
          if (n) {
            const t = new Error();
            console.warn(
              "DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" +
                t.stack,
            );
          } else
            xs &&
              console.log(
                "RxJS: Back to a better error behavior. Thank you. <3",
              );
          xs = n;
        },
        get useDeprecatedSynchronousErrorHandling() {
          return xs;
        },
      };
      function dr(n) {
        setTimeout(() => {
          throw n;
        }, 0);
      }
      const Sa = {
          closed: !0,
          next(n) {},
          error(n) {
            if (Yt.useDeprecatedSynchronousErrorHandling) throw n;
            dr(n);
          },
          complete() {},
        },
        mi = Array.isArray || ((n) => n && "number" == typeof n.length);
      function Ru(n) {
        return null !== n && "object" == typeof n;
      }
      const Ma = (() => {
        function n(t) {
          return (
            Error.call(this),
            (this.message = t
              ? `${t.length} errors occurred during unsubscription:\n${t.map((e, r) => `${r + 1}) ${e.toString()}`).join("\n  ")}`
              : ""),
            (this.name = "UnsubscriptionError"),
            (this.errors = t),
            this
          );
        }
        return (n.prototype = Object.create(Error.prototype)), n;
      })();
      class ue {
        constructor(t) {
          (this.closed = !1),
            (this._parentOrParents = null),
            (this._subscriptions = null),
            t && ((this._ctorUnsubscribe = !0), (this._unsubscribe = t));
        }
        unsubscribe() {
          let t;
          if (this.closed) return;
          let {
            _parentOrParents: e,
            _ctorUnsubscribe: r,
            _unsubscribe: i,
            _subscriptions: s,
          } = this;
          if (
            ((this.closed = !0),
            (this._parentOrParents = null),
            (this._subscriptions = null),
            e instanceof ue)
          )
            e.remove(this);
          else if (null !== e)
            for (let o = 0; o < e.length; ++o) e[o].remove(this);
          if (ur(i)) {
            r && (this._unsubscribe = void 0);
            try {
              i.call(this);
            } catch (o) {
              t = o instanceof Ma ? cm(o.errors) : [o];
            }
          }
          if (mi(s)) {
            let o = -1,
              a = s.length;
            for (; ++o < a; ) {
              const l = s[o];
              if (Ru(l))
                try {
                  l.unsubscribe();
                } catch (c) {
                  (t = t || []),
                    c instanceof Ma ? (t = t.concat(cm(c.errors))) : t.push(c);
                }
            }
          }
          if (t) throw new Ma(t);
        }
        add(t) {
          let e = t;
          if (!t) return ue.EMPTY;
          switch (typeof t) {
            case "function":
              e = new ue(t);
            case "object":
              if (e === this || e.closed || "function" != typeof e.unsubscribe)
                return e;
              if (this.closed) return e.unsubscribe(), e;
              if (!(e instanceof ue)) {
                const s = e;
                (e = new ue()), (e._subscriptions = [s]);
              }
              break;
            default:
              throw new Error(
                "unrecognized teardown " + t + " added to Subscription.",
              );
          }
          let { _parentOrParents: r } = e;
          if (null === r) e._parentOrParents = this;
          else if (r instanceof ue) {
            if (r === this) return e;
            e._parentOrParents = [r, this];
          } else {
            if (-1 !== r.indexOf(this)) return e;
            r.push(this);
          }
          const i = this._subscriptions;
          return null === i ? (this._subscriptions = [e]) : i.push(e), e;
        }
        remove(t) {
          const e = this._subscriptions;
          if (e) {
            const r = e.indexOf(t);
            -1 !== r && e.splice(r, 1);
          }
        }
      }
      var n;
      function cm(n) {
        return n.reduce((t, e) => t.concat(e instanceof Ma ? e.errors : e), []);
      }
      ue.EMPTY = (((n = new ue()).closed = !0), n);
      const Aa =
        "function" == typeof Symbol
          ? Symbol("rxSubscriber")
          : "@@rxSubscriber_" + Math.random();
      class ge extends ue {
        constructor(t, e, r) {
          switch (
            (super(),
            (this.syncErrorValue = null),
            (this.syncErrorThrown = !1),
            (this.syncErrorThrowable = !1),
            (this.isStopped = !1),
            arguments.length)
          ) {
            case 0:
              this.destination = Sa;
              break;
            case 1:
              if (!t) {
                this.destination = Sa;
                break;
              }
              if ("object" == typeof t) {
                t instanceof ge
                  ? ((this.syncErrorThrowable = t.syncErrorThrowable),
                    (this.destination = t),
                    t.add(this))
                  : ((this.syncErrorThrowable = !0),
                    (this.destination = new um(this, t)));
                break;
              }
            default:
              (this.syncErrorThrowable = !0),
                (this.destination = new um(this, t, e, r));
          }
        }
        [Aa]() {
          return this;
        }
        static create(t, e, r) {
          const i = new ge(t, e, r);
          return (i.syncErrorThrowable = !1), i;
        }
        next(t) {
          this.isStopped || this._next(t);
        }
        error(t) {
          this.isStopped || ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped || ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed || ((this.isStopped = !0), super.unsubscribe());
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          this.destination.error(t), this.unsubscribe();
        }
        _complete() {
          this.destination.complete(), this.unsubscribe();
        }
        _unsubscribeAndRecycle() {
          const { _parentOrParents: t } = this;
          return (
            (this._parentOrParents = null),
            this.unsubscribe(),
            (this.closed = !1),
            (this.isStopped = !1),
            (this._parentOrParents = t),
            this
          );
        }
      }
      class um extends ge {
        constructor(t, e, r, i) {
          super(), (this._parentSubscriber = t);
          let s,
            o = this;
          ur(e)
            ? (s = e)
            : e &&
              ((s = e.next),
              (r = e.error),
              (i = e.complete),
              e !== Sa &&
                ((o = Object.create(e)),
                ur(o.unsubscribe) && this.add(o.unsubscribe.bind(o)),
                (o.unsubscribe = this.unsubscribe.bind(this)))),
            (this._context = o),
            (this._next = s),
            (this._error = r),
            (this._complete = i);
        }
        next(t) {
          if (!this.isStopped && this._next) {
            const { _parentSubscriber: e } = this;
            Yt.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable
              ? this.__tryOrSetError(e, this._next, t) && this.unsubscribe()
              : this.__tryOrUnsub(this._next, t);
          }
        }
        error(t) {
          if (!this.isStopped) {
            const { _parentSubscriber: e } = this,
              { useDeprecatedSynchronousErrorHandling: r } = Yt;
            if (this._error)
              r && e.syncErrorThrowable
                ? (this.__tryOrSetError(e, this._error, t), this.unsubscribe())
                : (this.__tryOrUnsub(this._error, t), this.unsubscribe());
            else if (e.syncErrorThrowable)
              r ? ((e.syncErrorValue = t), (e.syncErrorThrown = !0)) : dr(t),
                this.unsubscribe();
            else {
              if ((this.unsubscribe(), r)) throw t;
              dr(t);
            }
          }
        }
        complete() {
          if (!this.isStopped) {
            const { _parentSubscriber: t } = this;
            if (this._complete) {
              const e = () => this._complete.call(this._context);
              Yt.useDeprecatedSynchronousErrorHandling && t.syncErrorThrowable
                ? (this.__tryOrSetError(t, e), this.unsubscribe())
                : (this.__tryOrUnsub(e), this.unsubscribe());
            } else this.unsubscribe();
          }
        }
        __tryOrUnsub(t, e) {
          try {
            t.call(this._context, e);
          } catch (r) {
            if ((this.unsubscribe(), Yt.useDeprecatedSynchronousErrorHandling))
              throw r;
            dr(r);
          }
        }
        __tryOrSetError(t, e, r) {
          if (!Yt.useDeprecatedSynchronousErrorHandling)
            throw new Error("bad call");
          try {
            e.call(this._context, r);
          } catch (i) {
            return Yt.useDeprecatedSynchronousErrorHandling
              ? ((t.syncErrorValue = i), (t.syncErrorThrown = !0), !0)
              : (dr(i), !0);
          }
          return !1;
        }
        _unsubscribe() {
          const { _parentSubscriber: t } = this;
          (this._context = null),
            (this._parentSubscriber = null),
            t.unsubscribe();
        }
      }
      const Os =
        ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Ta(n) {
        return n;
      }
      function dm(n) {
        return 0 === n.length
          ? Ta
          : 1 === n.length
            ? n[0]
            : function (e) {
                return n.reduce((r, i) => i(r), e);
              };
      }
      let ye = (() => {
        class n {
          constructor(e) {
            (this._isScalar = !1), e && (this._subscribe = e);
          }
          lift(e) {
            const r = new n();
            return (r.source = this), (r.operator = e), r;
          }
          subscribe(e, r, i) {
            const { operator: s } = this,
              o = (function rA(n, t, e) {
                if (n) {
                  if (n instanceof ge) return n;
                  if (n[Aa]) return n[Aa]();
                }
                return n || t || e ? new ge(n, t, e) : new ge(Sa);
              })(e, r, i);
            if (
              (o.add(
                s
                  ? s.call(o, this.source)
                  : this.source ||
                      (Yt.useDeprecatedSynchronousErrorHandling &&
                        !o.syncErrorThrowable)
                    ? this._subscribe(o)
                    : this._trySubscribe(o),
              ),
              Yt.useDeprecatedSynchronousErrorHandling &&
                o.syncErrorThrowable &&
                ((o.syncErrorThrowable = !1), o.syncErrorThrown))
            )
              throw o.syncErrorValue;
            return o;
          }
          _trySubscribe(e) {
            try {
              return this._subscribe(e);
            } catch (r) {
              Yt.useDeprecatedSynchronousErrorHandling &&
                ((e.syncErrorThrown = !0), (e.syncErrorValue = r)),
                (function nA(n) {
                  for (; n; ) {
                    const { closed: t, destination: e, isStopped: r } = n;
                    if (t || r) return !1;
                    n = e && e instanceof ge ? e : null;
                  }
                  return !0;
                })(e)
                  ? e.error(r)
                  : console.warn(r);
            }
          }
          forEach(e, r) {
            return new (r = hm(r))((i, s) => {
              let o;
              o = this.subscribe(
                (a) => {
                  try {
                    e(a);
                  } catch (l) {
                    s(l), o && o.unsubscribe();
                  }
                },
                s,
                i,
              );
            });
          }
          _subscribe(e) {
            const { source: r } = this;
            return r && r.subscribe(e);
          }
          [Os]() {
            return this;
          }
          pipe(...e) {
            return 0 === e.length ? this : dm(e)(this);
          }
          toPromise(e) {
            return new (e = hm(e))((r, i) => {
              let s;
              this.subscribe(
                (o) => (s = o),
                (o) => i(o),
                () => r(s),
              );
            });
          }
        }
        return (n.create = (t) => new n(t)), n;
      })();
      function hm(n) {
        if ((n || (n = Yt.Promise || Promise), !n))
          throw new Error("no Promise impl found");
        return n;
      }
      const _i = (() => {
        function n() {
          return (
            Error.call(this),
            (this.message = "object unsubscribed"),
            (this.name = "ObjectUnsubscribedError"),
            this
          );
        }
        return (n.prototype = Object.create(Error.prototype)), n;
      })();
      class sA extends ue {
        constructor(t, e) {
          super(),
            (this.subject = t),
            (this.subscriber = e),
            (this.closed = !1);
        }
        unsubscribe() {
          if (this.closed) return;
          this.closed = !0;
          const t = this.subject,
            e = t.observers;
          if (
            ((this.subject = null),
            !e || 0 === e.length || t.isStopped || t.closed)
          )
            return;
          const r = e.indexOf(this.subscriber);
          -1 !== r && e.splice(r, 1);
        }
      }
      class fm extends ge {
        constructor(t) {
          super(t), (this.destination = t);
        }
      }
      let de = (() => {
        class n extends ye {
          constructor() {
            super(),
              (this.observers = []),
              (this.closed = !1),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          [Aa]() {
            return new fm(this);
          }
          lift(e) {
            const r = new pm(this, this);
            return (r.operator = e), r;
          }
          next(e) {
            if (this.closed) throw new _i();
            if (!this.isStopped) {
              const { observers: r } = this,
                i = r.length,
                s = r.slice();
              for (let o = 0; o < i; o++) s[o].next(e);
            }
          }
          error(e) {
            if (this.closed) throw new _i();
            (this.hasError = !0), (this.thrownError = e), (this.isStopped = !0);
            const { observers: r } = this,
              i = r.length,
              s = r.slice();
            for (let o = 0; o < i; o++) s[o].error(e);
            this.observers.length = 0;
          }
          complete() {
            if (this.closed) throw new _i();
            this.isStopped = !0;
            const { observers: e } = this,
              r = e.length,
              i = e.slice();
            for (let s = 0; s < r; s++) i[s].complete();
            this.observers.length = 0;
          }
          unsubscribe() {
            (this.isStopped = !0), (this.closed = !0), (this.observers = null);
          }
          _trySubscribe(e) {
            if (this.closed) throw new _i();
            return super._trySubscribe(e);
          }
          _subscribe(e) {
            if (this.closed) throw new _i();
            return this.hasError
              ? (e.error(this.thrownError), ue.EMPTY)
              : this.isStopped
                ? (e.complete(), ue.EMPTY)
                : (this.observers.push(e), new sA(this, e));
          }
          asObservable() {
            const e = new ye();
            return (e.source = this), e;
          }
        }
        return (n.create = (t, e) => new pm(t, e)), n;
      })();
      class pm extends de {
        constructor(t, e) {
          super(), (this.destination = t), (this.source = e);
        }
        next(t) {
          const { destination: e } = this;
          e && e.next && e.next(t);
        }
        error(t) {
          const { destination: e } = this;
          e && e.error && this.destination.error(t);
        }
        complete() {
          const { destination: t } = this;
          t && t.complete && this.destination.complete();
        }
        _subscribe(t) {
          const { source: e } = this;
          return e ? this.source.subscribe(t) : ue.EMPTY;
        }
      }
      function yi(n) {
        return n && "function" == typeof n.schedule;
      }
      function U(n, t) {
        return function (r) {
          if ("function" != typeof n)
            throw new TypeError(
              "argument is not a function. Are you looking for `mapTo()`?",
            );
          return r.lift(new oA(n, t));
        };
      }
      class oA {
        constructor(t, e) {
          (this.project = t), (this.thisArg = e);
        }
        call(t, e) {
          return e.subscribe(new aA(t, this.project, this.thisArg));
        }
      }
      class aA extends ge {
        constructor(t, e, r) {
          super(t),
            (this.project = e),
            (this.count = 0),
            (this.thisArg = r || this);
        }
        _next(t) {
          let e;
          try {
            e = this.project.call(this.thisArg, t, this.count++);
          } catch (r) {
            return void this.destination.error(r);
          }
          this.destination.next(e);
        }
      }
      const gm = (n) => (t) => {
          for (let e = 0, r = n.length; e < r && !t.closed; e++) t.next(n[e]);
          t.complete();
        },
        Ia = (function cA() {
          return "function" == typeof Symbol && Symbol.iterator
            ? Symbol.iterator
            : "@@iterator";
        })(),
        mm = (n) => n && "number" == typeof n.length && "function" != typeof n;
      function _m(n) {
        return (
          !!n && "function" != typeof n.subscribe && "function" == typeof n.then
        );
      }
      const xu = (n) => {
        if (n && "function" == typeof n[Os])
          return ((n) => (t) => {
            const e = n[Os]();
            if ("function" != typeof e.subscribe)
              throw new TypeError(
                "Provided object does not correctly implement Symbol.observable",
              );
            return e.subscribe(t);
          })(n);
        if (mm(n)) return gm(n);
        if (_m(n))
          return ((n) => (t) => (
            n
              .then(
                (e) => {
                  t.closed || (t.next(e), t.complete());
                },
                (e) => t.error(e),
              )
              .then(null, dr),
            t
          ))(n);
        if (n && "function" == typeof n[Ia])
          return ((n) => (t) => {
            const e = n[Ia]();
            for (;;) {
              let r;
              try {
                r = e.next();
              } catch (i) {
                return t.error(i), t;
              }
              if (r.done) {
                t.complete();
                break;
              }
              if ((t.next(r.value), t.closed)) break;
            }
            return (
              "function" == typeof e.return &&
                t.add(() => {
                  e.return && e.return();
                }),
              t
            );
          })(n);
        {
          const e = `You provided ${Ru(n) ? "an invalid object" : `'${n}'`} where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.`;
          throw new TypeError(e);
        }
      };
      function Ou(n, t) {
        return new ye((e) => {
          const r = new ue();
          let i = 0;
          return (
            r.add(
              t.schedule(function () {
                i !== n.length
                  ? (e.next(n[i++]), e.closed || r.add(this.schedule()))
                  : e.complete();
              }),
            ),
            r
          );
        });
      }
      function ze(n, t) {
        return t
          ? (function _A(n, t) {
              if (null != n) {
                if (
                  (function gA(n) {
                    return n && "function" == typeof n[Os];
                  })(n)
                )
                  return (function hA(n, t) {
                    return new ye((e) => {
                      const r = new ue();
                      return (
                        r.add(
                          t.schedule(() => {
                            const i = n[Os]();
                            r.add(
                              i.subscribe({
                                next(s) {
                                  r.add(t.schedule(() => e.next(s)));
                                },
                                error(s) {
                                  r.add(t.schedule(() => e.error(s)));
                                },
                                complete() {
                                  r.add(t.schedule(() => e.complete()));
                                },
                              }),
                            );
                          }),
                        ),
                        r
                      );
                    });
                  })(n, t);
                if (_m(n))
                  return (function fA(n, t) {
                    return new ye((e) => {
                      const r = new ue();
                      return (
                        r.add(
                          t.schedule(() =>
                            n.then(
                              (i) => {
                                r.add(
                                  t.schedule(() => {
                                    e.next(i),
                                      r.add(t.schedule(() => e.complete()));
                                  }),
                                );
                              },
                              (i) => {
                                r.add(t.schedule(() => e.error(i)));
                              },
                            ),
                          ),
                        ),
                        r
                      );
                    });
                  })(n, t);
                if (mm(n)) return Ou(n, t);
                if (
                  (function mA(n) {
                    return n && "function" == typeof n[Ia];
                  })(n) ||
                  "string" == typeof n
                )
                  return (function pA(n, t) {
                    if (!n) throw new Error("Iterable cannot be null");
                    return new ye((e) => {
                      const r = new ue();
                      let i;
                      return (
                        r.add(() => {
                          i && "function" == typeof i.return && i.return();
                        }),
                        r.add(
                          t.schedule(() => {
                            (i = n[Ia]()),
                              r.add(
                                t.schedule(function () {
                                  if (e.closed) return;
                                  let s, o;
                                  try {
                                    const a = i.next();
                                    (s = a.value), (o = a.done);
                                  } catch (a) {
                                    return void e.error(a);
                                  }
                                  o
                                    ? e.complete()
                                    : (e.next(s), this.schedule());
                                }),
                              );
                          }),
                        ),
                        r
                      );
                    });
                  })(n, t);
              }
              throw new TypeError(
                ((null !== n && typeof n) || n) + " is not observable",
              );
            })(n, t)
          : n instanceof ye
            ? n
            : new ye(xu(n));
      }
      class ks extends ge {
        constructor(t) {
          super(), (this.parent = t);
        }
        _next(t) {
          this.parent.notifyNext(t);
        }
        _error(t) {
          this.parent.notifyError(t), this.unsubscribe();
        }
        _complete() {
          this.parent.notifyComplete(), this.unsubscribe();
        }
      }
      class Fs extends ge {
        notifyNext(t) {
          this.destination.next(t);
        }
        notifyError(t) {
          this.destination.error(t);
        }
        notifyComplete() {
          this.destination.complete();
        }
      }
      function Ps(n, t) {
        if (t.closed) return;
        if (n instanceof ye) return n.subscribe(t);
        let e;
        try {
          e = xu(n)(t);
        } catch (r) {
          t.error(r);
        }
        return e;
      }
      function st(n, t, e = Number.POSITIVE_INFINITY) {
        return "function" == typeof t
          ? (r) =>
              r.pipe(
                st((i, s) => ze(n(i, s)).pipe(U((o, a) => t(i, o, s, a))), e),
              )
          : ("number" == typeof t && (e = t), (r) => r.lift(new yA(n, e)));
      }
      class yA {
        constructor(t, e = Number.POSITIVE_INFINITY) {
          (this.project = t), (this.concurrent = e);
        }
        call(t, e) {
          return e.subscribe(new vA(t, this.project, this.concurrent));
        }
      }
      class vA extends Fs {
        constructor(t, e, r = Number.POSITIVE_INFINITY) {
          super(t),
            (this.project = e),
            (this.concurrent = r),
            (this.hasCompleted = !1),
            (this.buffer = []),
            (this.active = 0),
            (this.index = 0);
        }
        _next(t) {
          this.active < this.concurrent
            ? this._tryNext(t)
            : this.buffer.push(t);
        }
        _tryNext(t) {
          let e;
          const r = this.index++;
          try {
            e = this.project(t, r);
          } catch (i) {
            return void this.destination.error(i);
          }
          this.active++, this._innerSub(e);
        }
        _innerSub(t) {
          const e = new ks(this),
            r = this.destination;
          r.add(e);
          const i = Ps(t, e);
          i !== e && r.add(i);
        }
        _complete() {
          (this.hasCompleted = !0),
            0 === this.active &&
              0 === this.buffer.length &&
              this.destination.complete(),
            this.unsubscribe();
        }
        notifyNext(t) {
          this.destination.next(t);
        }
        notifyComplete() {
          const t = this.buffer;
          this.active--,
            t.length > 0
              ? this._next(t.shift())
              : 0 === this.active &&
                this.hasCompleted &&
                this.destination.complete();
        }
      }
      function vi(n = Number.POSITIVE_INFINITY) {
        return st(Ta, n);
      }
      function ku(n, t) {
        return t ? Ou(n, t) : new ye(gm(n));
      }
      function Ns(...n) {
        let t = Number.POSITIVE_INFINITY,
          e = null,
          r = n[n.length - 1];
        return (
          yi(r)
            ? ((e = n.pop()),
              n.length > 1 &&
                "number" == typeof n[n.length - 1] &&
                (t = n.pop()))
            : "number" == typeof r && (t = n.pop()),
          null === e && 1 === n.length && n[0] instanceof ye
            ? n[0]
            : vi(t)(ku(n, e))
        );
      }
      function Ra() {
        return function (t) {
          return t.lift(new bA(t));
        };
      }
      class bA {
        constructor(t) {
          this.connectable = t;
        }
        call(t, e) {
          const { connectable: r } = this;
          r._refCount++;
          const i = new CA(t, r),
            s = e.subscribe(i);
          return i.closed || (i.connection = r.connect()), s;
        }
      }
      class CA extends ge {
        constructor(t, e) {
          super(t), (this.connectable = e);
        }
        _unsubscribe() {
          const { connectable: t } = this;
          if (!t) return void (this.connection = null);
          this.connectable = null;
          const e = t._refCount;
          if (e <= 0) return void (this.connection = null);
          if (((t._refCount = e - 1), e > 1))
            return void (this.connection = null);
          const { connection: r } = this,
            i = t._connection;
          (this.connection = null), i && (!r || i === r) && i.unsubscribe();
        }
      }
      class Fu extends ye {
        constructor(t, e) {
          super(),
            (this.source = t),
            (this.subjectFactory = e),
            (this._refCount = 0),
            (this._isComplete = !1);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        connect() {
          let t = this._connection;
          return (
            t ||
              ((this._isComplete = !1),
              (t = this._connection = new ue()),
              t.add(this.source.subscribe(new wA(this.getSubject(), this))),
              t.closed && ((this._connection = null), (t = ue.EMPTY))),
            t
          );
        }
        refCount() {
          return Ra()(this);
        }
      }
      const DA = (() => {
        const n = Fu.prototype;
        return {
          operator: { value: null },
          _refCount: { value: 0, writable: !0 },
          _subject: { value: null, writable: !0 },
          _connection: { value: null, writable: !0 },
          _subscribe: { value: n._subscribe },
          _isComplete: { value: n._isComplete, writable: !0 },
          getSubject: { value: n.getSubject },
          connect: { value: n.connect },
          refCount: { value: n.refCount },
        };
      })();
      class wA extends fm {
        constructor(t, e) {
          super(t), (this.connectable = e);
        }
        _error(t) {
          this._unsubscribe(), super._error(t);
        }
        _complete() {
          (this.connectable._isComplete = !0),
            this._unsubscribe(),
            super._complete();
        }
        _unsubscribe() {
          const t = this.connectable;
          if (t) {
            this.connectable = null;
            const e = t._connection;
            (t._refCount = 0),
              (t._subject = null),
              (t._connection = null),
              e && e.unsubscribe();
          }
        }
      }
      class MA {
        constructor(t, e) {
          (this.subjectFactory = t), (this.selector = e);
        }
        call(t, e) {
          const { selector: r } = this,
            i = this.subjectFactory(),
            s = r(i).subscribe(t);
          return s.add(e.subscribe(i)), s;
        }
      }
      function AA() {
        return new de();
      }
      function ym() {
        return (n) =>
          Ra()(
            (function SA(n, t) {
              return function (r) {
                let i;
                if (
                  ((i =
                    "function" == typeof n
                      ? n
                      : function () {
                          return n;
                        }),
                  "function" == typeof t)
                )
                  return r.lift(new MA(i, t));
                const s = Object.create(r, DA);
                return (s.source = r), (s.subjectFactory = i), s;
              };
            })(AA)(n),
          );
      }
      function Ce(n) {
        for (let t in n) if (n[t] === Ce) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Pu(n, t) {
        for (const e in t)
          t.hasOwnProperty(e) && !n.hasOwnProperty(e) && (n[e] = t[e]);
      }
      function De(n) {
        if ("string" == typeof n) return n;
        if (Array.isArray(n)) return "[" + n.map(De).join(", ") + "]";
        if (null == n) return "" + n;
        if (n.overriddenName) return `${n.overriddenName}`;
        if (n.name) return `${n.name}`;
        const t = n.toString();
        if (null == t) return "" + t;
        const e = t.indexOf("\n");
        return -1 === e ? t : t.substring(0, e);
      }
      function Nu(n, t) {
        return null == n || "" === n
          ? null === t
            ? ""
            : t
          : null == t || "" === t
            ? n
            : n + " " + t;
      }
      const TA = Ce({ __forward_ref__: Ce });
      function we(n) {
        return (
          (n.__forward_ref__ = we),
          (n.toString = function () {
            return De(this());
          }),
          n
        );
      }
      function H(n) {
        return Lu(n) ? n() : n;
      }
      function Lu(n) {
        return (
          "function" == typeof n &&
          n.hasOwnProperty(TA) &&
          n.__forward_ref__ === we
        );
      }
      class C extends Error {
        constructor(t, e) {
          super(
            (function xa(n, t) {
              return `NG0${Math.abs(n)}${t ? ": " + t.trim() : ""}`;
            })(t, e),
          ),
            (this.code = t);
        }
      }
      function G(n) {
        return "string" == typeof n ? n : null == n ? "" : String(n);
      }
      function Oa(n, t) {
        throw new C(-201, !1);
      }
      function xt(n, t) {
        null == n &&
          (function me(n, t, e, r) {
            throw new Error(
              `ASSERTION ERROR: ${n}` +
                (null == r ? "" : ` [Expected=> ${e} ${r} ${t} <=Actual]`),
            );
          })(t, n, null, "!=");
      }
      function A(n) {
        return {
          token: n.token,
          providedIn: n.providedIn || null,
          factory: n.factory,
          value: void 0,
        };
      }
      function _e(n) {
        return { providers: n.providers || [], imports: n.imports || [] };
      }
      function ka(n) {
        return vm(n, Fa) || vm(n, Cm);
      }
      function vm(n, t) {
        return n.hasOwnProperty(t) ? n[t] : null;
      }
      function bm(n) {
        return n && (n.hasOwnProperty(Vu) || n.hasOwnProperty(LA))
          ? n[Vu]
          : null;
      }
      const Fa = Ce({ ɵprov: Ce }),
        Vu = Ce({ ɵinj: Ce }),
        Cm = Ce({ ngInjectableDef: Ce }),
        LA = Ce({ ngInjectorDef: Ce });
      var P = (() => (
        ((P = P || {})[(P.Default = 0)] = "Default"),
        (P[(P.Host = 1)] = "Host"),
        (P[(P.Self = 2)] = "Self"),
        (P[(P.SkipSelf = 4)] = "SkipSelf"),
        (P[(P.Optional = 8)] = "Optional"),
        P
      ))();
      let Bu;
      function Zt(n) {
        const t = Bu;
        return (Bu = n), t;
      }
      function Dm(n, t, e) {
        const r = ka(n);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : e & P.Optional
            ? null
            : void 0 !== t
              ? t
              : void Oa(De(n));
      }
      function hr(n) {
        return { toString: n }.toString();
      }
      var ln = (() => (
          ((ln = ln || {})[(ln.OnPush = 0)] = "OnPush"),
          (ln[(ln.Default = 1)] = "Default"),
          ln
        ))(),
        cn = (() => (
          (function (n) {
            (n[(n.Emulated = 0)] = "Emulated"),
              (n[(n.None = 2)] = "None"),
              (n[(n.ShadowDom = 3)] = "ShadowDom");
          })(cn || (cn = {})),
          cn
        ))();
      const Ee = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        bi = {},
        fe = [],
        Pa = Ce({ ɵcmp: Ce }),
        ju = Ce({ ɵdir: Ce }),
        Uu = Ce({ ɵpipe: Ce }),
        wm = Ce({ ɵmod: Ce }),
        Hn = Ce({ ɵfac: Ce }),
        Ls = Ce({ __NG_ELEMENT_ID__: Ce });
      let BA = 0;
      function Ot(n) {
        return hr(() => {
          const e = !0 === n.standalone,
            r = {},
            i = {
              type: n.type,
              providersResolver: null,
              decls: n.decls,
              vars: n.vars,
              factory: null,
              template: n.template || null,
              consts: n.consts || null,
              ngContentSelectors: n.ngContentSelectors,
              hostBindings: n.hostBindings || null,
              hostVars: n.hostVars || 0,
              hostAttrs: n.hostAttrs || null,
              contentQueries: n.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: n.exportAs || null,
              onPush: n.changeDetection === ln.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: e,
              dependencies: (e && n.dependencies) || null,
              getStandaloneInjector: null,
              selectors: n.selectors || fe,
              viewQuery: n.viewQuery || null,
              features: n.features || null,
              data: n.data || {},
              encapsulation: n.encapsulation || cn.Emulated,
              id: "c" + BA++,
              styles: n.styles || fe,
              _: null,
              setInput: null,
              schemas: n.schemas || null,
              tView: null,
            },
            s = n.dependencies,
            o = n.features;
          return (
            (i.inputs = Mm(n.inputs, r)),
            (i.outputs = Mm(n.outputs)),
            o && o.forEach((a) => a(i)),
            (i.directiveDefs = s
              ? () => ("function" == typeof s ? s() : s).map(Em).filter(Sm)
              : null),
            (i.pipeDefs = s
              ? () => ("function" == typeof s ? s() : s).map(pt).filter(Sm)
              : null),
            i
          );
        });
      }
      function Em(n) {
        return be(n) || ft(n);
      }
      function Sm(n) {
        return null !== n;
      }
      function ve(n) {
        return hr(() => ({
          type: n.type,
          bootstrap: n.bootstrap || fe,
          declarations: n.declarations || fe,
          imports: n.imports || fe,
          exports: n.exports || fe,
          transitiveCompileScopes: null,
          schemas: n.schemas || null,
          id: n.id || null,
        }));
      }
      function Mm(n, t) {
        if (null == n) return bi;
        const e = {};
        for (const r in n)
          if (n.hasOwnProperty(r)) {
            let i = n[r],
              s = i;
            Array.isArray(i) && ((s = i[1]), (i = i[0])),
              (e[i] = r),
              t && (t[i] = s);
          }
        return e;
      }
      const F = Ot;
      function Dt(n) {
        return {
          type: n.type,
          name: n.name,
          factory: null,
          pure: !1 !== n.pure,
          standalone: !0 === n.standalone,
          onDestroy: n.type.prototype.ngOnDestroy || null,
        };
      }
      function be(n) {
        return n[Pa] || null;
      }
      function ft(n) {
        return n[ju] || null;
      }
      function pt(n) {
        return n[Uu] || null;
      }
      function kt(n, t) {
        const e = n[wm] || null;
        if (!e && !0 === t)
          throw new Error(`Type ${De(n)} does not have '\u0275mod' property.`);
        return e;
      }
      const K = 11;
      function wt(n) {
        return Array.isArray(n) && "object" == typeof n[1];
      }
      function dn(n) {
        return Array.isArray(n) && !0 === n[1];
      }
      function zu(n) {
        return 0 != (8 & n.flags);
      }
      function Ba(n) {
        return 2 == (2 & n.flags);
      }
      function ja(n) {
        return 1 == (1 & n.flags);
      }
      function hn(n) {
        return null !== n.template;
      }
      function GA(n) {
        return 0 != (256 & n[2]);
      }
      function Br(n, t) {
        return n.hasOwnProperty(Hn) ? n[Hn] : null;
      }
      class KA {
        constructor(t, e, r) {
          (this.previousValue = t),
            (this.currentValue = e),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Xt() {
        return Im;
      }
      function Im(n) {
        return n.type.prototype.ngOnChanges && (n.setInput = ZA), YA;
      }
      function YA() {
        const n = xm(this),
          t = n?.current;
        if (t) {
          const e = n.previous;
          if (e === bi) n.previous = t;
          else for (let r in t) e[r] = t[r];
          (n.current = null), this.ngOnChanges(t);
        }
      }
      function ZA(n, t, e, r) {
        const i =
            xm(n) ||
            (function QA(n, t) {
              return (n[Rm] = t);
            })(n, { previous: bi, current: null }),
          s = i.current || (i.current = {}),
          o = i.previous,
          a = this.declaredInputs[e],
          l = o[a];
        (s[a] = new KA(l && l.currentValue, t, o === bi)), (n[r] = t);
      }
      Xt.ngInherit = !0;
      const Rm = "__ngSimpleChanges__";
      function xm(n) {
        return n[Rm] || null;
      }
      function Ve(n) {
        for (; Array.isArray(n); ) n = n[0];
        return n;
      }
      function Ua(n, t) {
        return Ve(t[n]);
      }
      function Pt(n, t) {
        return Ve(t[n.index]);
      }
      function Yu(n, t) {
        return n.data[t];
      }
      function Si(n, t) {
        return n[t];
      }
      function Nt(n, t) {
        const e = t[n];
        return wt(e) ? e : e[0];
      }
      function Ha(n) {
        return 64 == (64 & n[2]);
      }
      function fr(n, t) {
        return null == t ? null : n[t];
      }
      function Om(n) {
        n[18] = 0;
      }
      function Zu(n, t) {
        n[5] += t;
        let e = n,
          r = n[3];
        for (
          ;
          null !== r && ((1 === t && 1 === e[5]) || (-1 === t && 0 === e[5]));

        )
          (r[5] += t), (e = r), (r = r[3]);
      }
      const z = { lFrame: Hm(null), bindingsEnabled: !0 };
      function Fm() {
        return z.bindingsEnabled;
      }
      function D() {
        return z.lFrame.lView;
      }
      function se() {
        return z.lFrame.tView;
      }
      function Et(n) {
        return (z.lFrame.contextLView = n), n[8];
      }
      function St(n) {
        return (z.lFrame.contextLView = null), n;
      }
      function Ge() {
        let n = Pm();
        for (; null !== n && 64 === n.type; ) n = n.parent;
        return n;
      }
      function Pm() {
        return z.lFrame.currentTNode;
      }
      function En(n, t) {
        const e = z.lFrame;
        (e.currentTNode = n), (e.isParent = t);
      }
      function Qu() {
        return z.lFrame.isParent;
      }
      function Xu() {
        z.lFrame.isParent = !1;
      }
      function gt() {
        const n = z.lFrame;
        let t = n.bindingRootIndex;
        return (
          -1 === t && (t = n.bindingRootIndex = n.tView.bindingStartIndex), t
        );
      }
      function Mi() {
        return z.lFrame.bindingIndex++;
      }
      function hT(n, t) {
        const e = z.lFrame;
        (e.bindingIndex = e.bindingRootIndex = n), Ju(t);
      }
      function Ju(n) {
        z.lFrame.currentDirectiveIndex = n;
      }
      function ed(n) {
        const t = z.lFrame.currentDirectiveIndex;
        return -1 === t ? null : n[t];
      }
      function Bm() {
        return z.lFrame.currentQueryIndex;
      }
      function td(n) {
        z.lFrame.currentQueryIndex = n;
      }
      function pT(n) {
        const t = n[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? n[6] : null;
      }
      function jm(n, t, e) {
        if (e & P.SkipSelf) {
          let i = t,
            s = n;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              e & P.Host ||
              ((i = pT(s)), null === i || ((s = s[15]), 10 & i.type)));

          );
          if (null === i) return !1;
          (t = i), (n = s);
        }
        const r = (z.lFrame = Um());
        return (r.currentTNode = t), (r.lView = n), !0;
      }
      function nd(n) {
        const t = Um(),
          e = n[1];
        (z.lFrame = t),
          (t.currentTNode = e.firstChild),
          (t.lView = n),
          (t.tView = e),
          (t.contextLView = n),
          (t.bindingIndex = e.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Um() {
        const n = z.lFrame,
          t = null === n ? null : n.child;
        return null === t ? Hm(n) : t;
      }
      function Hm(n) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: n,
          child: null,
          inI18n: !1,
        };
        return null !== n && (n.child = t), t;
      }
      function $m() {
        const n = z.lFrame;
        return (
          (z.lFrame = n.parent), (n.currentTNode = null), (n.lView = null), n
        );
      }
      const zm = $m;
      function rd() {
        const n = $m();
        (n.isParent = !0),
          (n.tView = null),
          (n.selectedIndex = -1),
          (n.contextLView = null),
          (n.elementDepthCount = 0),
          (n.currentDirectiveIndex = -1),
          (n.currentNamespace = null),
          (n.bindingRootIndex = -1),
          (n.bindingIndex = -1),
          (n.currentQueryIndex = 0);
      }
      function mt() {
        return z.lFrame.selectedIndex;
      }
      function pr(n) {
        z.lFrame.selectedIndex = n;
      }
      function Re() {
        const n = z.lFrame;
        return Yu(n.tView, n.selectedIndex);
      }
      function $a(n, t) {
        for (let e = t.directiveStart, r = t.directiveEnd; e < r; e++) {
          const s = n.data[e].type.prototype,
            {
              ngAfterContentInit: o,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: c,
              ngOnDestroy: u,
            } = s;
          o && (n.contentHooks || (n.contentHooks = [])).push(-e, o),
            a &&
              ((n.contentHooks || (n.contentHooks = [])).push(e, a),
              (n.contentCheckHooks || (n.contentCheckHooks = [])).push(e, a)),
            l && (n.viewHooks || (n.viewHooks = [])).push(-e, l),
            c &&
              ((n.viewHooks || (n.viewHooks = [])).push(e, c),
              (n.viewCheckHooks || (n.viewCheckHooks = [])).push(e, c)),
            null != u && (n.destroyHooks || (n.destroyHooks = [])).push(e, u);
        }
      }
      function za(n, t, e) {
        Wm(n, t, 3, e);
      }
      function Ga(n, t, e, r) {
        (3 & n[2]) === e && Wm(n, t, e, r);
      }
      function id(n, t) {
        let e = n[2];
        (3 & e) === t && ((e &= 2047), (e += 1), (n[2] = e));
      }
      function Wm(n, t, e, r) {
        const s = r ?? -1,
          o = t.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & n[18] : 0; l < o; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != r && a >= r)) break;
          } else
            t[l] < 0 && (n[18] += 65536),
              (a < s || -1 == s) &&
                (DT(n, e, t, l), (n[18] = (4294901760 & n[18]) + l + 2)),
              l++;
      }
      function DT(n, t, e, r) {
        const i = e[r] < 0,
          s = e[r + 1],
          a = n[i ? -e[r] : e[r]];
        if (i) {
          if (n[2] >> 11 < n[18] >> 16 && (3 & n[2]) === t) {
            n[2] += 2048;
            try {
              s.call(a);
            } finally {
            }
          }
        } else
          try {
            s.call(a);
          } finally {
          }
      }
      class $s {
        constructor(t, e, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = e),
            (this.injectImpl = r);
        }
      }
      function Wa(n, t, e) {
        let r = 0;
        for (; r < e.length; ) {
          const i = e[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const s = e[r++],
              o = e[r++],
              a = e[r++];
            n.setAttribute(t, o, a, s);
          } else {
            const s = i,
              o = e[++r];
            Km(s) ? n.setProperty(t, s, o) : n.setAttribute(t, s, o), r++;
          }
        }
        return r;
      }
      function qm(n) {
        return 3 === n || 4 === n || 6 === n;
      }
      function Km(n) {
        return 64 === n.charCodeAt(0);
      }
      function qa(n, t) {
        if (null !== t && 0 !== t.length)
          if (null === n || 0 === n.length) n = t.slice();
          else {
            let e = -1;
            for (let r = 0; r < t.length; r++) {
              const i = t[r];
              "number" == typeof i
                ? (e = i)
                : 0 === e ||
                  Ym(n, e, i, null, -1 === e || 2 === e ? t[++r] : null);
            }
          }
        return n;
      }
      function Ym(n, t, e, r, i) {
        let s = 0,
          o = n.length;
        if (-1 === t) o = -1;
        else
          for (; s < n.length; ) {
            const a = n[s++];
            if ("number" == typeof a) {
              if (a === t) {
                o = -1;
                break;
              }
              if (a > t) {
                o = s - 1;
                break;
              }
            }
          }
        for (; s < n.length; ) {
          const a = n[s];
          if ("number" == typeof a) break;
          if (a === e) {
            if (null === r) return void (null !== i && (n[s + 1] = i));
            if (r === n[s + 1]) return void (n[s + 2] = i);
          }
          s++, null !== r && s++, null !== i && s++;
        }
        -1 !== o && (n.splice(o, 0, t), (s = o + 1)),
          n.splice(s++, 0, e),
          null !== r && n.splice(s++, 0, r),
          null !== i && n.splice(s++, 0, i);
      }
      function Zm(n) {
        return -1 !== n;
      }
      function Ai(n) {
        return 32767 & n;
      }
      function Ti(n, t) {
        let e = (function AT(n) {
            return n >> 16;
          })(n),
          r = t;
        for (; e > 0; ) (r = r[15]), e--;
        return r;
      }
      let od = !0;
      function Ka(n) {
        const t = od;
        return (od = n), t;
      }
      let TT = 0;
      const Sn = {};
      function Gs(n, t) {
        const e = ld(n, t);
        if (-1 !== e) return e;
        const r = t[1];
        r.firstCreatePass &&
          ((n.injectorIndex = t.length),
          ad(r.data, n),
          ad(t, null),
          ad(r.blueprint, null));
        const i = Ya(n, t),
          s = n.injectorIndex;
        if (Zm(i)) {
          const o = Ai(i),
            a = Ti(i, t),
            l = a[1].data;
          for (let c = 0; c < 8; c++) t[s + c] = a[o + c] | l[o + c];
        }
        return (t[s + 8] = i), s;
      }
      function ad(n, t) {
        n.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function ld(n, t) {
        return -1 === n.injectorIndex ||
          (n.parent && n.parent.injectorIndex === n.injectorIndex) ||
          null === t[n.injectorIndex + 8]
          ? -1
          : n.injectorIndex;
      }
      function Ya(n, t) {
        if (n.parent && -1 !== n.parent.injectorIndex)
          return n.parent.injectorIndex;
        let e = 0,
          r = null,
          i = t;
        for (; null !== i; ) {
          if (((r = s_(i)), null === r)) return -1;
          if ((e++, (i = i[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (e << 16);
        }
        return -1;
      }
      function Za(n, t, e) {
        !(function IT(n, t, e) {
          let r;
          "string" == typeof e
            ? (r = e.charCodeAt(0) || 0)
            : e.hasOwnProperty(Ls) && (r = e[Ls]),
            null == r && (r = e[Ls] = TT++);
          const i = 255 & r;
          t.data[n + (i >> 5)] |= 1 << i;
        })(n, t, e);
      }
      function Jm(n, t, e) {
        if (e & P.Optional || void 0 !== n) return n;
        Oa();
      }
      function e_(n, t, e, r) {
        if (
          (e & P.Optional && void 0 === r && (r = null),
          0 == (e & (P.Self | P.Host)))
        ) {
          const i = n[9],
            s = Zt(void 0);
          try {
            return i ? i.get(t, r, e & P.Optional) : Dm(t, r, e & P.Optional);
          } finally {
            Zt(s);
          }
        }
        return Jm(r, 0, e);
      }
      function t_(n, t, e, r = P.Default, i) {
        if (null !== n) {
          if (1024 & t[2]) {
            const o = (function FT(n, t, e, r, i) {
              let s = n,
                o = t;
              for (
                ;
                null !== s && null !== o && 1024 & o[2] && !(256 & o[2]);

              ) {
                const a = n_(s, o, e, r | P.Self, Sn);
                if (a !== Sn) return a;
                let l = s.parent;
                if (!l) {
                  const c = o[21];
                  if (c) {
                    const u = c.get(e, Sn, r);
                    if (u !== Sn) return u;
                  }
                  (l = s_(o)), (o = o[15]);
                }
                s = l;
              }
              return i;
            })(n, t, e, r, Sn);
            if (o !== Sn) return o;
          }
          const s = n_(n, t, e, r, Sn);
          if (s !== Sn) return s;
        }
        return e_(t, e, r, i);
      }
      function n_(n, t, e, r, i) {
        const s = (function OT(n) {
          if ("string" == typeof n) return n.charCodeAt(0) || 0;
          const t = n.hasOwnProperty(Ls) ? n[Ls] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : kT) : t;
        })(e);
        if ("function" == typeof s) {
          if (!jm(t, n, r)) return r & P.Host ? Jm(i, 0, r) : e_(t, e, r, i);
          try {
            const o = s(r);
            if (null != o || r & P.Optional) return o;
            Oa();
          } finally {
            zm();
          }
        } else if ("number" == typeof s) {
          let o = null,
            a = ld(n, t),
            l = -1,
            c = r & P.Host ? t[16][6] : null;
          for (
            (-1 === a || r & P.SkipSelf) &&
            ((l = -1 === a ? Ya(n, t) : t[a + 8]),
            -1 !== l && i_(r, !1)
              ? ((o = t[1]), (a = Ai(l)), (t = Ti(l, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const u = t[1];
            if (r_(s, a, u.data)) {
              const d = xT(a, t, e, o, r, c);
              if (d !== Sn) return d;
            }
            (l = t[a + 8]),
              -1 !== l && i_(r, t[1].data[a + 8] === c) && r_(s, a, t)
                ? ((o = u), (a = Ai(l)), (t = Ti(l, t)))
                : (a = -1);
          }
        }
        return i;
      }
      function xT(n, t, e, r, i, s) {
        const o = t[1],
          a = o.data[n + 8],
          u = Qa(
            a,
            o,
            e,
            null == r ? Ba(a) && od : r != o && 0 != (3 & a.type),
            i & P.Host && s === a,
          );
        return null !== u ? Ws(t, o, u, a) : Sn;
      }
      function Qa(n, t, e, r, i) {
        const s = n.providerIndexes,
          o = t.data,
          a = 1048575 & s,
          l = n.directiveStart,
          u = s >> 20,
          h = i ? a + u : n.directiveEnd;
        for (let f = r ? a : a + u; f < h; f++) {
          const p = o[f];
          if ((f < l && e === p) || (f >= l && p.type === e)) return f;
        }
        if (i) {
          const f = o[l];
          if (f && hn(f) && f.type === e) return l;
        }
        return null;
      }
      function Ws(n, t, e, r) {
        let i = n[e];
        const s = t.data;
        if (
          (function wT(n) {
            return n instanceof $s;
          })(i)
        ) {
          const o = i;
          o.resolving &&
            (function IA(n, t) {
              const e = t ? `. Dependency path: ${t.join(" > ")} > ${n}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${n}${e}`,
              );
            })(
              (function he(n) {
                return "function" == typeof n
                  ? n.name || n.toString()
                  : "object" == typeof n &&
                      null != n &&
                      "function" == typeof n.type
                    ? n.type.name || n.type.toString()
                    : G(n);
              })(s[e]),
            );
          const a = Ka(o.canSeeViewProviders);
          o.resolving = !0;
          const l = o.injectImpl ? Zt(o.injectImpl) : null;
          jm(n, r, P.Default);
          try {
            (i = n[e] = o.factory(void 0, s, n, r)),
              t.firstCreatePass &&
                e >= r.directiveStart &&
                (function CT(n, t, e) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: s,
                  } = t.type.prototype;
                  if (r) {
                    const o = Im(t);
                    (e.preOrderHooks || (e.preOrderHooks = [])).push(n, o),
                      (
                        e.preOrderCheckHooks || (e.preOrderCheckHooks = [])
                      ).push(n, o);
                  }
                  i &&
                    (e.preOrderHooks || (e.preOrderHooks = [])).push(0 - n, i),
                    s &&
                      ((e.preOrderHooks || (e.preOrderHooks = [])).push(n, s),
                      (
                        e.preOrderCheckHooks || (e.preOrderCheckHooks = [])
                      ).push(n, s));
                })(e, s[e], t);
          } finally {
            null !== l && Zt(l), Ka(a), (o.resolving = !1), zm();
          }
        }
        return i;
      }
      function r_(n, t, e) {
        return !!(e[t + (n >> 5)] & (1 << n));
      }
      function i_(n, t) {
        return !(n & P.Self || (n & P.Host && t));
      }
      class Ii {
        constructor(t, e) {
          (this._tNode = t), (this._lView = e);
        }
        get(t, e, r) {
          return t_(this._tNode, this._lView, t, r, e);
        }
      }
      function kT() {
        return new Ii(Ge(), D());
      }
      function We(n) {
        return hr(() => {
          const t = n.prototype.constructor,
            e = t[Hn] || cd(t),
            r = Object.prototype;
          let i = Object.getPrototypeOf(n.prototype).constructor;
          for (; i && i !== r; ) {
            const s = i[Hn] || cd(i);
            if (s && s !== e) return s;
            i = Object.getPrototypeOf(i);
          }
          return (s) => new s();
        });
      }
      function cd(n) {
        return Lu(n)
          ? () => {
              const t = cd(H(n));
              return t && t();
            }
          : Br(n);
      }
      function s_(n) {
        const t = n[1],
          e = t.type;
        return 2 === e ? t.declTNode : 1 === e ? n[6] : null;
      }
      function Ri(n) {
        return (function RT(n, t) {
          if ("class" === t) return n.classes;
          if ("style" === t) return n.styles;
          const e = n.attrs;
          if (e) {
            const r = e.length;
            let i = 0;
            for (; i < r; ) {
              const s = e[i];
              if (qm(s)) break;
              if (0 === s) i += 2;
              else if ("number" == typeof s)
                for (i++; i < r && "string" == typeof e[i]; ) i++;
              else {
                if (s === t) return e[i + 1];
                i += 2;
              }
            }
          }
          return null;
        })(Ge(), n);
      }
      const Oi = "__parameters__";
      function Fi(n, t, e) {
        return hr(() => {
          const r = (function ud(n) {
            return function (...e) {
              if (n) {
                const r = n(...e);
                for (const i in r) this[i] = r[i];
              }
            };
          })(t);
          function i(...s) {
            if (this instanceof i) return r.apply(this, s), this;
            const o = new i(...s);
            return (a.annotation = o), a;
            function a(l, c, u) {
              const d = l.hasOwnProperty(Oi)
                ? l[Oi]
                : Object.defineProperty(l, Oi, { value: [] })[Oi];
              for (; d.length <= u; ) d.push(null);
              return (d[u] = d[u] || []).push(o), l;
            }
          }
          return (
            e && (i.prototype = Object.create(e.prototype)),
            (i.prototype.ngMetadataName = n),
            (i.annotationCls = i),
            i
          );
        });
      }
      class w {
        constructor(t, e) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof e
              ? (this.__NG_ELEMENT_ID__ = e)
              : void 0 !== e &&
                (this.ɵprov = A({
                  token: this,
                  providedIn: e.providedIn || "root",
                  factory: e.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function Lt(n, t) {
        void 0 === t && (t = n);
        for (let e = 0; e < n.length; e++) {
          let r = n[e];
          Array.isArray(r)
            ? (t === n && (t = n.slice(0, e)), Lt(r, t))
            : t !== n && t.push(r);
        }
        return t;
      }
      function Gn(n, t) {
        n.forEach((e) => (Array.isArray(e) ? Gn(e, t) : t(e)));
      }
      function a_(n, t, e) {
        t >= n.length ? n.push(e) : n.splice(t, 0, e);
      }
      function Xa(n, t) {
        return t >= n.length - 1 ? n.pop() : n.splice(t, 1)[0];
      }
      function Ys(n, t) {
        const e = [];
        for (let r = 0; r < n; r++) e.push(t);
        return e;
      }
      function Vt(n, t, e) {
        let r = Pi(n, t);
        return (
          r >= 0
            ? (n[1 | r] = e)
            : ((r = ~r),
              (function VT(n, t, e, r) {
                let i = n.length;
                if (i == t) n.push(e, r);
                else if (1 === i) n.push(r, n[0]), (n[0] = e);
                else {
                  for (i--, n.push(n[i - 1], n[i]); i > t; )
                    (n[i] = n[i - 2]), i--;
                  (n[t] = e), (n[t + 1] = r);
                }
              })(n, r, t, e)),
          r
        );
      }
      function hd(n, t) {
        const e = Pi(n, t);
        if (e >= 0) return n[1 | e];
      }
      function Pi(n, t) {
        return (function u_(n, t, e) {
          let r = 0,
            i = n.length >> e;
          for (; i !== r; ) {
            const s = r + ((i - r) >> 1),
              o = n[s << e];
            if (t === o) return s << e;
            o > t ? (i = s) : (r = s + 1);
          }
          return ~(i << e);
        })(n, t, 1);
      }
      const Zs = {},
        pd = "__NG_DI_FLAG__",
        el = "ngTempTokenPath",
        WT = /\n/gm,
        d_ = "__source";
      let Qs;
      function Ni(n) {
        const t = Qs;
        return (Qs = n), t;
      }
      function KT(n, t = P.Default) {
        if (void 0 === Qs) throw new C(-203, !1);
        return null === Qs
          ? Dm(n, void 0, t)
          : Qs.get(n, t & P.Optional ? null : void 0, t);
      }
      function m(n, t = P.Default) {
        return (
          (function VA() {
            return Bu;
          })() || KT
        )(H(n), t);
      }
      function te(n, t = P.Default) {
        return (
          "number" != typeof t &&
            (t =
              0 |
              (t.optional && 8) |
              (t.host && 1) |
              (t.self && 2) |
              (t.skipSelf && 4)),
          m(n, t)
        );
      }
      function gd(n) {
        const t = [];
        for (let e = 0; e < n.length; e++) {
          const r = H(n[e]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let i,
              s = P.Default;
            for (let o = 0; o < r.length; o++) {
              const a = r[o],
                l = YT(a);
              "number" == typeof l
                ? -1 === l
                  ? (i = a.token)
                  : (s |= l)
                : (i = a);
            }
            t.push(m(i, s));
          } else t.push(m(r));
        }
        return t;
      }
      function Xs(n, t) {
        return (n[pd] = t), (n.prototype[pd] = t), n;
      }
      function YT(n) {
        return n[pd];
      }
      const Js = Xs(
          Fi("Inject", (n) => ({ token: n })),
          -1,
        ),
        Wn = Xs(Fi("Optional"), 8),
        jr = Xs(Fi("SkipSelf"), 4);
      var Mt = (() => (
        ((Mt = Mt || {})[(Mt.Important = 1)] = "Important"),
        (Mt[(Mt.DashCase = 2)] = "DashCase"),
        Mt
      ))();
      const vd = new Map();
      let fI = 0;
      const Cd = "__ngContext__";
      function lt(n, t) {
        wt(t)
          ? ((n[Cd] = t[20]),
            (function gI(n) {
              vd.set(n[20], n);
            })(t))
          : (n[Cd] = t);
      }
      function wd(n, t) {
        return undefined(n, t);
      }
      function ro(n) {
        const t = n[3];
        return dn(t) ? t[3] : t;
      }
      function Ed(n) {
        return O_(n[13]);
      }
      function Sd(n) {
        return O_(n[4]);
      }
      function O_(n) {
        for (; null !== n && !dn(n); ) n = n[4];
        return n;
      }
      function Vi(n, t, e, r, i) {
        if (null != r) {
          let s,
            o = !1;
          dn(r) ? (s = r) : wt(r) && ((o = !0), (r = r[0]));
          const a = Ve(r);
          0 === n && null !== e
            ? null == i
              ? V_(t, e, a)
              : Ur(t, e, a, i || null, !0)
            : 1 === n && null !== e
              ? Ur(t, e, a, i || null, !0)
              : 2 === n
                ? (function Od(n, t, e) {
                    const r = rl(n, t);
                    r &&
                      (function LI(n, t, e, r) {
                        n.removeChild(t, e, r);
                      })(n, r, t, e);
                  })(t, a, o)
                : 3 === n && t.destroyNode(a),
            null != s &&
              (function jI(n, t, e, r, i) {
                const s = e[7];
                s !== Ve(e) && Vi(t, n, r, s, i);
                for (let a = 10; a < e.length; a++) {
                  const l = e[a];
                  io(l[1], l, n, t, r, s);
                }
              })(t, n, s, e, i);
        }
      }
      function Ad(n, t, e) {
        return n.createElement(t, e);
      }
      function F_(n, t) {
        const e = n[9],
          r = e.indexOf(t),
          i = t[3];
        512 & t[2] && ((t[2] &= -513), Zu(i, -1)), e.splice(r, 1);
      }
      function Td(n, t) {
        if (n.length <= 10) return;
        const e = 10 + t,
          r = n[e];
        if (r) {
          const i = r[17];
          null !== i && i !== n && F_(i, r), t > 0 && (n[e - 1][4] = r[4]);
          const s = Xa(n, 10 + t);
          !(function II(n, t) {
            io(n, t, t[K], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const o = s[19];
          null !== o && o.detachView(s[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function P_(n, t) {
        if (!(128 & t[2])) {
          const e = t[K];
          e.destroyNode && io(n, t, e, 3, null, null),
            (function OI(n) {
              let t = n[13];
              if (!t) return Id(n[1], n);
              for (; t; ) {
                let e = null;
                if (wt(t)) e = t[13];
                else {
                  const r = t[10];
                  r && (e = r);
                }
                if (!e) {
                  for (; t && !t[4] && t !== n; )
                    wt(t) && Id(t[1], t), (t = t[3]);
                  null === t && (t = n), wt(t) && Id(t[1], t), (e = t && t[4]);
                }
                t = e;
              }
            })(t);
        }
      }
      function Id(n, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function NI(n, t) {
              let e;
              if (null != n && null != (e = n.destroyHooks))
                for (let r = 0; r < e.length; r += 2) {
                  const i = t[e[r]];
                  if (!(i instanceof $s)) {
                    const s = e[r + 1];
                    if (Array.isArray(s))
                      for (let o = 0; o < s.length; o += 2) {
                        const a = i[s[o]],
                          l = s[o + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        s.call(i);
                      } finally {
                      }
                  }
                }
            })(n, t),
            (function PI(n, t) {
              const e = n.cleanup,
                r = t[7];
              let i = -1;
              if (null !== e)
                for (let s = 0; s < e.length - 1; s += 2)
                  if ("string" == typeof e[s]) {
                    const o = e[s + 1],
                      a = "function" == typeof o ? o(t) : Ve(t[o]),
                      l = r[(i = e[s + 2])],
                      c = e[s + 3];
                    "boolean" == typeof c
                      ? a.removeEventListener(e[s], l, c)
                      : c >= 0
                        ? r[(i = c)]()
                        : r[(i = -c)].unsubscribe(),
                      (s += 2);
                  } else {
                    const o = r[(i = e[s + 1])];
                    e[s].call(o);
                  }
              if (null !== r) {
                for (let s = i + 1; s < r.length; s++) (0, r[s])();
                t[7] = null;
              }
            })(n, t),
            1 === t[1].type && t[K].destroy();
          const e = t[17];
          if (null !== e && dn(t[3])) {
            e !== t[3] && F_(e, t);
            const r = t[19];
            null !== r && r.detachView(n);
          }
          !(function mI(n) {
            vd.delete(n[20]);
          })(t);
        }
      }
      function N_(n, t, e) {
        return (function L_(n, t, e) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return e[0];
          if (2 & r.flags) {
            const i = n.data[r.directiveStart].encapsulation;
            if (i === cn.None || i === cn.Emulated) return null;
          }
          return Pt(r, e);
        })(n, t.parent, e);
      }
      function Ur(n, t, e, r, i) {
        n.insertBefore(t, e, r, i);
      }
      function V_(n, t, e) {
        n.appendChild(t, e);
      }
      function B_(n, t, e, r, i) {
        null !== r ? Ur(n, t, e, r, i) : V_(n, t, e);
      }
      function rl(n, t) {
        return n.parentNode(t);
      }
      function j_(n, t, e) {
        return H_(n, t, e);
      }
      let ol,
        Nd,
        H_ = function U_(n, t, e) {
          return 40 & n.type ? Pt(n, e) : null;
        };
      function il(n, t, e, r) {
        const i = N_(n, r, t),
          s = t[K],
          a = j_(r.parent || t[6], r, t);
        if (null != i)
          if (Array.isArray(e))
            for (let l = 0; l < e.length; l++) B_(s, i, e[l], a, !1);
          else B_(s, i, e, a, !1);
      }
      function sl(n, t) {
        if (null !== t) {
          const e = t.type;
          if (3 & e) return Pt(t, n);
          if (4 & e) return xd(-1, n[t.index]);
          if (8 & e) {
            const r = t.child;
            if (null !== r) return sl(n, r);
            {
              const i = n[t.index];
              return dn(i) ? xd(-1, i) : Ve(i);
            }
          }
          if (32 & e) return wd(t, n)() || Ve(n[t.index]);
          {
            const r = z_(n, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : sl(ro(n[16]), r)
              : sl(n, t.next);
          }
        }
        return null;
      }
      function z_(n, t) {
        return null !== t ? n[16][6].projection[t.projection] : null;
      }
      function xd(n, t) {
        const e = 10 + n + 1;
        if (e < t.length) {
          const r = t[e],
            i = r[1].firstChild;
          if (null !== i) return sl(r, i);
        }
        return t[7];
      }
      function kd(n, t, e, r, i, s, o) {
        for (; null != e; ) {
          const a = r[e.index],
            l = e.type;
          if (
            (o && 0 === t && (a && lt(Ve(a), r), (e.flags |= 4)),
            64 != (64 & e.flags))
          )
            if (8 & l) kd(n, t, e.child, r, i, s, !1), Vi(t, n, i, a, s);
            else if (32 & l) {
              const c = wd(e, r);
              let u;
              for (; (u = c()); ) Vi(t, n, i, u, s);
              Vi(t, n, i, a, s);
            } else 16 & l ? G_(n, t, r, e, i, s) : Vi(t, n, i, a, s);
          e = o ? e.projectionNext : e.next;
        }
      }
      function io(n, t, e, r, i, s) {
        kd(e, r, n.firstChild, t, i, s, !1);
      }
      function G_(n, t, e, r, i, s) {
        const o = e[16],
          l = o[6].projection[r.projection];
        if (Array.isArray(l))
          for (let c = 0; c < l.length; c++) Vi(t, n, i, l[c], s);
        else kd(n, t, l, o[3], i, s, !0);
      }
      function W_(n, t, e) {
        n.setAttribute(t, "style", e);
      }
      function Fd(n, t, e) {
        "" === e
          ? n.removeAttribute(t, "class")
          : n.setAttribute(t, "class", e);
      }
      function Hr(n) {
        return (
          (function Pd() {
            if (void 0 === ol && ((ol = null), Ee.trustedTypes))
              try {
                ol = Ee.trustedTypes.createPolicy("angular", {
                  createHTML: (n) => n,
                  createScript: (n) => n,
                  createScriptURL: (n) => n,
                });
              } catch {}
            return ol;
          })()?.createHTML(n) || n
        );
      }
      class $r {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      class WI extends $r {
        getTypeName() {
          return "HTML";
        }
      }
      class qI extends $r {
        getTypeName() {
          return "Style";
        }
      }
      class KI extends $r {
        getTypeName() {
          return "Script";
        }
      }
      class YI extends $r {
        getTypeName() {
          return "URL";
        }
      }
      class ZI extends $r {
        getTypeName() {
          return "ResourceURL";
        }
      }
      function Bt(n) {
        return n instanceof $r ? n.changingThisBreaksApplicationSecurity : n;
      }
      function Mn(n, t) {
        const e = (function QI(n) {
          return (n instanceof $r && n.getTypeName()) || null;
        })(n);
        if (null != e && e !== t) {
          if ("ResourceURL" === e && "URL" === t) return !0;
          throw new Error(
            `Required a safe ${t}, got a ${e} (see https://g.co/ng/security#xss)`,
          );
        }
        return e === t;
      }
      class rR {
        constructor(t) {
          this.inertDocumentHelper = t;
        }
        getInertBodyElement(t) {
          t = "<body><remove></remove>" + t;
          try {
            const e = new window.DOMParser().parseFromString(
              Hr(t),
              "text/html",
            ).body;
            return null === e
              ? this.inertDocumentHelper.getInertBodyElement(t)
              : (e.removeChild(e.firstChild), e);
          } catch {
            return null;
          }
        }
      }
      class iR {
        constructor(t) {
          if (
            ((this.defaultDoc = t),
            (this.inertDocument =
              this.defaultDoc.implementation.createHTMLDocument(
                "sanitization-inert",
              )),
            null == this.inertDocument.body)
          ) {
            const e = this.inertDocument.createElement("html");
            this.inertDocument.appendChild(e);
            const r = this.inertDocument.createElement("body");
            e.appendChild(r);
          }
        }
        getInertBodyElement(t) {
          const e = this.inertDocument.createElement("template");
          if ("content" in e) return (e.innerHTML = Hr(t)), e;
          const r = this.inertDocument.createElement("body");
          return (
            (r.innerHTML = Hr(t)),
            this.defaultDoc.documentMode && this.stripCustomNsAttrs(r),
            r
          );
        }
        stripCustomNsAttrs(t) {
          const e = t.attributes;
          for (let i = e.length - 1; 0 < i; i--) {
            const o = e.item(i).name;
            ("xmlns:ns1" === o || 0 === o.indexOf("ns1:")) &&
              t.removeAttribute(o);
          }
          let r = t.firstChild;
          for (; r; )
            r.nodeType === Node.ELEMENT_NODE && this.stripCustomNsAttrs(r),
              (r = r.nextSibling);
        }
      }
      const oR =
        /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
      function ll(n) {
        return (n = String(n)).match(oR) ? n : "unsafe:" + n;
      }
      function qn(n) {
        const t = {};
        for (const e of n.split(",")) t[e] = !0;
        return t;
      }
      function so(...n) {
        const t = {};
        for (const e of n)
          for (const r in e) e.hasOwnProperty(r) && (t[r] = !0);
        return t;
      }
      const X_ = qn("area,br,col,hr,img,wbr"),
        J_ = qn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        ey = qn("rp,rt"),
        Vd = so(
          X_,
          so(
            J_,
            qn(
              "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul",
            ),
          ),
          so(
            ey,
            qn(
              "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video",
            ),
          ),
          so(ey, J_),
        ),
        Bd = qn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
        ty = so(
          Bd,
          qn(
            "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width",
          ),
          qn(
            "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext",
          ),
        ),
        aR = qn("script,style,template");
      class lR {
        constructor() {
          (this.sanitizedSomething = !1), (this.buf = []);
        }
        sanitizeChildren(t) {
          let e = t.firstChild,
            r = !0;
          for (; e; )
            if (
              (e.nodeType === Node.ELEMENT_NODE
                ? (r = this.startElement(e))
                : e.nodeType === Node.TEXT_NODE
                  ? this.chars(e.nodeValue)
                  : (this.sanitizedSomething = !0),
              r && e.firstChild)
            )
              e = e.firstChild;
            else
              for (; e; ) {
                e.nodeType === Node.ELEMENT_NODE && this.endElement(e);
                let i = this.checkClobberedElement(e, e.nextSibling);
                if (i) {
                  e = i;
                  break;
                }
                e = this.checkClobberedElement(e, e.parentNode);
              }
          return this.buf.join("");
        }
        startElement(t) {
          const e = t.nodeName.toLowerCase();
          if (!Vd.hasOwnProperty(e))
            return (this.sanitizedSomething = !0), !aR.hasOwnProperty(e);
          this.buf.push("<"), this.buf.push(e);
          const r = t.attributes;
          for (let i = 0; i < r.length; i++) {
            const s = r.item(i),
              o = s.name,
              a = o.toLowerCase();
            if (!ty.hasOwnProperty(a)) {
              this.sanitizedSomething = !0;
              continue;
            }
            let l = s.value;
            Bd[a] && (l = ll(l)), this.buf.push(" ", o, '="', ny(l), '"');
          }
          return this.buf.push(">"), !0;
        }
        endElement(t) {
          const e = t.nodeName.toLowerCase();
          Vd.hasOwnProperty(e) &&
            !X_.hasOwnProperty(e) &&
            (this.buf.push("</"), this.buf.push(e), this.buf.push(">"));
        }
        chars(t) {
          this.buf.push(ny(t));
        }
        checkClobberedElement(t, e) {
          if (
            e &&
            (t.compareDocumentPosition(e) &
              Node.DOCUMENT_POSITION_CONTAINED_BY) ===
              Node.DOCUMENT_POSITION_CONTAINED_BY
          )
            throw new Error(
              `Failed to sanitize html because the element is clobbered: ${t.outerHTML}`,
            );
          return e;
        }
      }
      const cR = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        uR = /([^\#-~ |!])/g;
      function ny(n) {
        return n
          .replace(/&/g, "&amp;")
          .replace(cR, function (t) {
            return (
              "&#" +
              (1024 * (t.charCodeAt(0) - 55296) +
                (t.charCodeAt(1) - 56320) +
                65536) +
              ";"
            );
          })
          .replace(uR, function (t) {
            return "&#" + t.charCodeAt(0) + ";";
          })
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
      let cl;
      function ry(n, t) {
        let e = null;
        try {
          cl =
            cl ||
            (function Q_(n) {
              const t = new iR(n);
              return (function sR() {
                try {
                  return !!new window.DOMParser().parseFromString(
                    Hr(""),
                    "text/html",
                  );
                } catch {
                  return !1;
                }
              })()
                ? new rR(t)
                : t;
            })(n);
          let r = t ? String(t) : "";
          e = cl.getInertBodyElement(r);
          let i = 5,
            s = r;
          do {
            if (0 === i)
              throw new Error(
                "Failed to sanitize html because the input is unstable",
              );
            i--, (r = s), (s = e.innerHTML), (e = cl.getInertBodyElement(r));
          } while (r !== s);
          return Hr(new lR().sanitizeChildren(jd(e) || e));
        } finally {
          if (e) {
            const r = jd(e) || e;
            for (; r.firstChild; ) r.removeChild(r.firstChild);
          }
        }
      }
      function jd(n) {
        return "content" in n &&
          (function dR(n) {
            return (
              n.nodeType === Node.ELEMENT_NODE && "TEMPLATE" === n.nodeName
            );
          })(n)
          ? n.content
          : null;
      }
      var pe = (() => (
        ((pe = pe || {})[(pe.NONE = 0)] = "NONE"),
        (pe[(pe.HTML = 1)] = "HTML"),
        (pe[(pe.STYLE = 2)] = "STYLE"),
        (pe[(pe.SCRIPT = 3)] = "SCRIPT"),
        (pe[(pe.URL = 4)] = "URL"),
        (pe[(pe.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        pe
      ))();
      const ao = new w("ENVIRONMENT_INITIALIZER"),
        sy = new w("INJECTOR", -1),
        oy = new w("INJECTOR_DEF_TYPES");
      class ay {
        get(t, e = Zs) {
          if (e === Zs) {
            const r = new Error(`NullInjectorError: No provider for ${De(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return e;
        }
      }
      function vR(...n) {
        return { ɵproviders: ly(0, n) };
      }
      function ly(n, ...t) {
        const e = [],
          r = new Set();
        let i;
        return (
          Gn(t, (s) => {
            const o = s;
            Hd(o, e, [], r) && (i || (i = []), i.push(o));
          }),
          void 0 !== i && cy(i, e),
          e
        );
      }
      function cy(n, t) {
        for (let e = 0; e < n.length; e++) {
          const { providers: i } = n[e];
          Gn(i, (s) => {
            t.push(s);
          });
        }
      }
      function Hd(n, t, e, r) {
        if (!(n = H(n))) return !1;
        let i = null,
          s = bm(n);
        const o = !s && be(n);
        if (s || o) {
          if (o && !o.standalone) return !1;
          i = n;
        } else {
          const l = n.ngModule;
          if (((s = bm(l)), !s)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (o) {
          if (a) return !1;
          if ((r.add(i), o.dependencies)) {
            const l =
              "function" == typeof o.dependencies
                ? o.dependencies()
                : o.dependencies;
            for (const c of l) Hd(c, t, e, r);
          }
        } else {
          if (!s) return !1;
          {
            if (null != s.imports && !a) {
              let c;
              r.add(i);
              try {
                Gn(s.imports, (u) => {
                  Hd(u, t, e, r) && (c || (c = []), c.push(u));
                });
              } finally {
              }
              void 0 !== c && cy(c, t);
            }
            if (!a) {
              const c = Br(i) || (() => new i());
              t.push(
                { provide: i, useFactory: c, deps: fe },
                { provide: oy, useValue: i, multi: !0 },
                { provide: ao, useValue: () => m(i), multi: !0 },
              );
            }
            const l = s.providers;
            null == l ||
              a ||
              Gn(l, (u) => {
                t.push(u);
              });
          }
        }
        return i !== n && void 0 !== n.providers;
      }
      const bR = Ce({ provide: String, useValue: Ce });
      function $d(n) {
        return null !== n && "object" == typeof n && bR in n;
      }
      function zr(n) {
        return "function" == typeof n;
      }
      const zd = new w("Set Injector scope."),
        ul = {},
        DR = {};
      let Gd;
      function dl() {
        return void 0 === Gd && (Gd = new ay()), Gd;
      }
      class mr {}
      class hy extends mr {
        constructor(t, e, r, i) {
          super(),
            (this.parent = e),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            qd(t, (o) => this.processProvider(o)),
            this.records.set(sy, Bi(void 0, this)),
            i.has("environment") && this.records.set(mr, Bi(void 0, this));
          const s = this.records.get(zd);
          null != s && "string" == typeof s.value && this.scopes.add(s.value),
            (this.injectorDefTypes = new Set(this.get(oy.multi, fe, P.Self)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const e = Ni(this),
            r = Zt(void 0);
          try {
            return t();
          } finally {
            Ni(e), Zt(r);
          }
        }
        get(t, e = Zs, r = P.Default) {
          this.assertNotDestroyed();
          const i = Ni(this),
            s = Zt(void 0);
          try {
            if (!(r & P.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const l =
                  (function AR(n) {
                    return (
                      "function" == typeof n ||
                      ("object" == typeof n && n instanceof w)
                    );
                  })(t) && ka(t);
                (a = l && this.injectableDefInScope(l) ? Bi(Wd(t), ul) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & P.Self ? dl() : this.parent).get(
              t,
              (e = r & P.Optional && e === Zs ? null : e),
            );
          } catch (o) {
            if ("NullInjectorError" === o.name) {
              if (((o[el] = o[el] || []).unshift(De(t)), i)) throw o;
              return (function ZT(n, t, e, r) {
                const i = n[el];
                throw (
                  (t[d_] && i.unshift(t[d_]),
                  (n.message = (function QT(n, t, e, r = null) {
                    n =
                      n && "\n" === n.charAt(0) && "\u0275" == n.charAt(1)
                        ? n.slice(2)
                        : n;
                    let i = De(t);
                    if (Array.isArray(t)) i = t.map(De).join(" -> ");
                    else if ("object" == typeof t) {
                      let s = [];
                      for (let o in t)
                        if (t.hasOwnProperty(o)) {
                          let a = t[o];
                          s.push(
                            o +
                              ":" +
                              ("string" == typeof a
                                ? JSON.stringify(a)
                                : De(a)),
                          );
                        }
                      i = `{${s.join(", ")}}`;
                    }
                    return `${e}${r ? "(" + r + ")" : ""}[${i}]: ${n.replace(WT, "\n  ")}`;
                  })("\n" + n.message, i, e, r)),
                  (n.ngTokenPath = i),
                  (n[el] = null),
                  n)
                );
              })(o, t, "R3InjectorError", this.source);
            }
            throw o;
          } finally {
            Zt(s), Ni(i);
          }
        }
        resolveInjectorInitializers() {
          const t = Ni(this),
            e = Zt(void 0);
          try {
            const r = this.get(ao.multi, fe, P.Self);
            for (const i of r) i();
          } finally {
            Ni(t), Zt(e);
          }
        }
        toString() {
          const t = [],
            e = this.records;
          for (const r of e.keys()) t.push(De(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let e = zr((t = H(t))) ? t : H(t && t.provide);
          const r = (function ER(n) {
            return $d(n) ? Bi(void 0, n.useValue) : Bi(fy(n), ul);
          })(t);
          if (zr(t) || !0 !== t.multi) this.records.get(e);
          else {
            let i = this.records.get(e);
            i ||
              ((i = Bi(void 0, ul, !0)),
              (i.factory = () => gd(i.multi)),
              this.records.set(e, i)),
              (e = t),
              i.multi.push(t);
          }
          this.records.set(e, r);
        }
        hydrate(t, e) {
          return (
            e.value === ul && ((e.value = DR), (e.value = e.factory())),
            "object" == typeof e.value &&
              e.value &&
              (function MR(n) {
                return (
                  null !== n &&
                  "object" == typeof n &&
                  "function" == typeof n.ngOnDestroy
                );
              })(e.value) &&
              this._ngOnDestroyHooks.add(e.value),
            e.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const e = H(t.providedIn);
          return "string" == typeof e
            ? "any" === e || this.scopes.has(e)
            : this.injectorDefTypes.has(e);
        }
      }
      function Wd(n) {
        const t = ka(n),
          e = null !== t ? t.factory : Br(n);
        if (null !== e) return e;
        if (n instanceof w) throw new C(204, !1);
        if (n instanceof Function)
          return (function wR(n) {
            const t = n.length;
            if (t > 0) throw (Ys(t, "?"), new C(204, !1));
            const e = (function PA(n) {
              const t = n && (n[Fa] || n[Cm]);
              if (t) {
                const e = (function NA(n) {
                  if (n.hasOwnProperty("name")) return n.name;
                  const t = ("" + n).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(n);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${e}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${e}" class.`,
                  ),
                  t
                );
              }
              return null;
            })(n);
            return null !== e ? () => e.factory(n) : () => new n();
          })(n);
        throw new C(204, !1);
      }
      function fy(n, t, e) {
        let r;
        if (zr(n)) {
          const i = H(n);
          return Br(i) || Wd(i);
        }
        if ($d(n)) r = () => H(n.useValue);
        else if (
          (function dy(n) {
            return !(!n || !n.useFactory);
          })(n)
        )
          r = () => n.useFactory(...gd(n.deps || []));
        else if (
          (function uy(n) {
            return !(!n || !n.useExisting);
          })(n)
        )
          r = () => m(H(n.useExisting));
        else {
          const i = H(n && (n.useClass || n.provide));
          if (
            !(function SR(n) {
              return !!n.deps;
            })(n)
          )
            return Br(i) || Wd(i);
          r = () => new i(...gd(n.deps));
        }
        return r;
      }
      function Bi(n, t, e = !1) {
        return { factory: n, value: t, multi: e ? [] : void 0 };
      }
      function TR(n) {
        return !!n.ɵproviders;
      }
      function qd(n, t) {
        for (const e of n)
          Array.isArray(e) ? qd(e, t) : TR(e) ? qd(e.ɵproviders, t) : t(e);
      }
      class py {}
      class xR {
        resolveComponentFactory(t) {
          throw (function RR(n) {
            const t = Error(
              `No component factory found for ${De(n)}. Did you add it to @NgModule.entryComponents?`,
            );
            return (t.ngComponent = n), t;
          })(t);
        }
      }
      let Gr = (() => {
        class n {}
        return (n.NULL = new xR()), n;
      })();
      function OR() {
        return ji(Ge(), D());
      }
      function ji(n, t) {
        return new Ie(Pt(n, t));
      }
      let Ie = (() => {
        class n {
          constructor(e) {
            this.nativeElement = e;
          }
        }
        return (n.__NG_ELEMENT_ID__ = OR), n;
      })();
      function kR(n) {
        return n instanceof Ie ? n.nativeElement : n;
      }
      class lo {}
      let Kn = (() => {
          class n {}
          return (
            (n.__NG_ELEMENT_ID__ = () =>
              (function FR() {
                const n = D(),
                  e = Nt(Ge().index, n);
                return (wt(e) ? e : n)[K];
              })()),
            n
          );
        })(),
        PR = (() => {
          class n {}
          return (
            (n.ɵprov = A({
              token: n,
              providedIn: "root",
              factory: () => null,
            })),
            n
          );
        })();
      class _r {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const NR = new _r("14.2.12"),
        Kd = {};
      function Zd(n) {
        return n.ngOriginalError;
      }
      class Yn {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const e = this._findOriginalError(t);
          this._console.error("ERROR", t),
            e && this._console.error("ORIGINAL ERROR", e);
        }
        _findOriginalError(t) {
          let e = t && Zd(t);
          for (; e && Zd(e); ) e = Zd(e);
          return e || null;
        }
      }
      function Zn(n) {
        return n instanceof Function ? n() : n;
      }
      function _y(n, t, e) {
        let r = n.length;
        for (;;) {
          const i = n.indexOf(t, e);
          if (-1 === i) return i;
          if (0 === i || n.charCodeAt(i - 1) <= 32) {
            const s = t.length;
            if (i + s === r || n.charCodeAt(i + s) <= 32) return i;
          }
          e = i + 1;
        }
      }
      const yy = "ng-template";
      function qR(n, t, e) {
        let r = 0;
        for (; r < n.length; ) {
          let i = n[r++];
          if (e && "class" === i) {
            if (((i = n[r]), -1 !== _y(i.toLowerCase(), t, 0))) return !0;
          } else if (1 === i) {
            for (; r < n.length && "string" == typeof (i = n[r++]); )
              if (i.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function vy(n) {
        return 4 === n.type && n.value !== yy;
      }
      function KR(n, t, e) {
        return t === (4 !== n.type || e ? n.value : yy);
      }
      function YR(n, t, e) {
        let r = 4;
        const i = n.attrs || [],
          s = (function XR(n) {
            for (let t = 0; t < n.length; t++) if (qm(n[t])) return t;
            return n.length;
          })(i);
        let o = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!o)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !KR(n, l, e)) || ("" === l && 1 === t.length))
                ) {
                  if (fn(r)) return !1;
                  o = !0;
                }
              } else {
                const c = 8 & r ? l : t[++a];
                if (8 & r && null !== n.attrs) {
                  if (!qR(n.attrs, c, e)) {
                    if (fn(r)) return !1;
                    o = !0;
                  }
                  continue;
                }
                const d = ZR(8 & r ? "class" : l, i, vy(n), e);
                if (-1 === d) {
                  if (fn(r)) return !1;
                  o = !0;
                  continue;
                }
                if ("" !== c) {
                  let h;
                  h = d > s ? "" : i[d + 1].toLowerCase();
                  const f = 8 & r ? h : null;
                  if ((f && -1 !== _y(f, c, 0)) || (2 & r && c !== h)) {
                    if (fn(r)) return !1;
                    o = !0;
                  }
                }
              }
          } else {
            if (!o && !fn(r) && !fn(l)) return !1;
            if (o && fn(l)) continue;
            (o = !1), (r = l | (1 & r));
          }
        }
        return fn(r) || o;
      }
      function fn(n) {
        return 0 == (1 & n);
      }
      function ZR(n, t, e, r) {
        if (null === t) return -1;
        let i = 0;
        if (r || !e) {
          let s = !1;
          for (; i < t.length; ) {
            const o = t[i];
            if (o === n) return i;
            if (3 === o || 6 === o) s = !0;
            else {
              if (1 === o || 2 === o) {
                let a = t[++i];
                for (; "string" == typeof a; ) a = t[++i];
                continue;
              }
              if (4 === o) break;
              if (0 === o) {
                i += 4;
                continue;
              }
            }
            i += s ? 1 : 2;
          }
          return -1;
        }
        return (function JR(n, t) {
          let e = n.indexOf(4);
          if (e > -1)
            for (e++; e < n.length; ) {
              const r = n[e];
              if ("number" == typeof r) return -1;
              if (r === t) return e;
              e++;
            }
          return -1;
        })(t, n);
      }
      function by(n, t, e = !1) {
        for (let r = 0; r < t.length; r++) if (YR(n, t[r], e)) return !0;
        return !1;
      }
      function ex(n, t) {
        e: for (let e = 0; e < t.length; e++) {
          const r = t[e];
          if (n.length === r.length) {
            for (let i = 0; i < n.length; i++) if (n[i] !== r[i]) continue e;
            return !0;
          }
        }
        return !1;
      }
      function Cy(n, t) {
        return n ? ":not(" + t.trim() + ")" : t;
      }
      function tx(n) {
        let t = n[0],
          e = 1,
          r = 2,
          i = "",
          s = !1;
        for (; e < n.length; ) {
          let o = n[e];
          if ("string" == typeof o)
            if (2 & r) {
              const a = n[++e];
              i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + o) : 4 & r && (i += " " + o);
          else
            "" !== i && !fn(o) && ((t += Cy(s, i)), (i = "")),
              (r = o),
              (s = s || !fn(r));
          e++;
        }
        return "" !== i && (t += Cy(s, i)), t;
      }
      const W = {};
      function L(n) {
        Dy(se(), D(), mt() + n, !1);
      }
      function Dy(n, t, e, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const s = n.preOrderCheckHooks;
            null !== s && za(t, s, e);
          } else {
            const s = n.preOrderHooks;
            null !== s && Ga(t, s, 0, e);
          }
        pr(e);
      }
      function My(n, t = null, e = null, r) {
        const i = Ay(n, t, e, r);
        return i.resolveInjectorInitializers(), i;
      }
      function Ay(n, t = null, e = null, r, i = new Set()) {
        const s = [e || fe, vR(n)];
        return (
          (r = r || ("object" == typeof n ? void 0 : De(n))),
          new hy(s, t || dl(), r || null, i)
        );
      }
      let Ne = (() => {
        class n {
          static create(e, r) {
            if (Array.isArray(e)) return My({ name: "" }, r, e, "");
            {
              const i = e.name ?? "";
              return My({ name: i }, e.parent, e.providers, i);
            }
          }
        }
        return (
          (n.THROW_IF_NOT_FOUND = Zs),
          (n.NULL = new ay()),
          (n.ɵprov = A({ token: n, providedIn: "any", factory: () => m(sy) })),
          (n.__NG_ELEMENT_ID__ = -1),
          n
        );
      })();
      function _(n, t = P.Default) {
        const e = D();
        return null === e ? m(n, t) : t_(Ge(), e, H(n), t);
      }
      function fl() {
        throw new Error("invalid");
      }
      function pl(n, t) {
        return (n << 17) | (t << 2);
      }
      function pn(n) {
        return (n >> 17) & 32767;
      }
      function th(n) {
        return 2 | n;
      }
      function Qn(n) {
        return (131068 & n) >> 2;
      }
      function nh(n, t) {
        return (-131069 & n) | (t << 2);
      }
      function rh(n) {
        return 1 | n;
      }
      function zy(n, t) {
        const e = n.contentQueries;
        if (null !== e)
          for (let r = 0; r < e.length; r += 2) {
            const i = e[r],
              s = e[r + 1];
            if (-1 !== s) {
              const o = n.data[s];
              td(i), o.contentQueries(2, t[s], s);
            }
          }
      }
      function _l(n, t, e, r, i, s, o, a, l, c, u) {
        const d = t.blueprint.slice();
        return (
          (d[0] = i),
          (d[2] = 76 | r),
          (null !== u || (n && 1024 & n[2])) && (d[2] |= 1024),
          Om(d),
          (d[3] = d[15] = n),
          (d[8] = e),
          (d[10] = o || (n && n[10])),
          (d[K] = a || (n && n[K])),
          (d[12] = l || (n && n[12]) || null),
          (d[9] = c || (n && n[9]) || null),
          (d[6] = s),
          (d[20] = (function pI() {
            return fI++;
          })()),
          (d[21] = u),
          (d[16] = 2 == t.type ? n[16] : d),
          d
        );
      }
      function $i(n, t, e, r, i) {
        let s = n.data[t];
        if (null === s)
          (s = (function dh(n, t, e, r, i) {
            const s = Pm(),
              o = Qu(),
              l = (n.data[t] = (function Lx(n, t, e, r, i, s) {
                return {
                  type: e,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: i,
                  attrs: s,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, o ? s : s && s.parent, e, t, r, i));
            return (
              null === n.firstChild && (n.firstChild = l),
              null !== s &&
                (o
                  ? null == s.child && null !== l.parent && (s.child = l)
                  : null === s.next && (s.next = l)),
              l
            );
          })(n, t, e, r, i)),
            (function dT() {
              return z.lFrame.inI18n;
            })() && (s.flags |= 64);
        else if (64 & s.type) {
          (s.type = e), (s.value = r), (s.attrs = i);
          const o = (function Hs() {
            const n = z.lFrame,
              t = n.currentTNode;
            return n.isParent ? t : t.parent;
          })();
          s.injectorIndex = null === o ? -1 : o.injectorIndex;
        }
        return En(s, !0), s;
      }
      function zi(n, t, e, r) {
        if (0 === e) return -1;
        const i = t.length;
        for (let s = 0; s < e; s++)
          t.push(r), n.blueprint.push(r), n.data.push(null);
        return i;
      }
      function hh(n, t, e) {
        nd(t);
        try {
          const r = n.viewQuery;
          null !== r && bh(1, r, e);
          const i = n.template;
          null !== i && Gy(n, t, i, 1, e),
            n.firstCreatePass && (n.firstCreatePass = !1),
            n.staticContentQueries && zy(n, t),
            n.staticViewQueries && bh(2, n.viewQuery, e);
          const s = n.components;
          null !== s &&
            (function Fx(n, t) {
              for (let e = 0; e < t.length; e++) Jx(n, t[e]);
            })(t, s);
        } catch (r) {
          throw (
            (n.firstCreatePass &&
              ((n.incompleteFirstPass = !0), (n.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), rd();
        }
      }
      function yl(n, t, e, r) {
        const i = t[2];
        if (128 != (128 & i)) {
          nd(t);
          try {
            Om(t),
              (function Lm(n) {
                return (z.lFrame.bindingIndex = n);
              })(n.bindingStartIndex),
              null !== e && Gy(n, t, e, 2, r);
            const o = 3 == (3 & i);
            if (o) {
              const c = n.preOrderCheckHooks;
              null !== c && za(t, c, null);
            } else {
              const c = n.preOrderHooks;
              null !== c && Ga(t, c, 0, null), id(t, 0);
            }
            if (
              ((function Qx(n) {
                for (let t = Ed(n); null !== t; t = Sd(t)) {
                  if (!t[2]) continue;
                  const e = t[9];
                  for (let r = 0; r < e.length; r++) {
                    const i = e[r],
                      s = i[3];
                    0 == (512 & i[2]) && Zu(s, 1), (i[2] |= 512);
                  }
                }
              })(t),
              (function Zx(n) {
                for (let t = Ed(n); null !== t; t = Sd(t))
                  for (let e = 10; e < t.length; e++) {
                    const r = t[e],
                      i = r[1];
                    Ha(r) && yl(i, r, i.template, r[8]);
                  }
              })(t),
              null !== n.contentQueries && zy(n, t),
              o)
            ) {
              const c = n.contentCheckHooks;
              null !== c && za(t, c);
            } else {
              const c = n.contentHooks;
              null !== c && Ga(t, c, 1), id(t, 1);
            }
            !(function Ox(n, t) {
              const e = n.hostBindingOpCodes;
              if (null !== e)
                try {
                  for (let r = 0; r < e.length; r++) {
                    const i = e[r];
                    if (i < 0) pr(~i);
                    else {
                      const s = i,
                        o = e[++r],
                        a = e[++r];
                      hT(o, s), a(2, t[s]);
                    }
                  }
                } finally {
                  pr(-1);
                }
            })(n, t);
            const a = n.components;
            null !== a &&
              (function kx(n, t) {
                for (let e = 0; e < t.length; e++) Xx(n, t[e]);
              })(t, a);
            const l = n.viewQuery;
            if ((null !== l && bh(2, l, r), o)) {
              const c = n.viewCheckHooks;
              null !== c && za(t, c);
            } else {
              const c = n.viewHooks;
              null !== c && Ga(t, c, 2), id(t, 2);
            }
            !0 === n.firstUpdatePass && (n.firstUpdatePass = !1),
              (t[2] &= -41),
              512 & t[2] && ((t[2] &= -513), Zu(t[3], -1));
          } finally {
            rd();
          }
        }
      }
      function Gy(n, t, e, r, i) {
        const s = mt(),
          o = 2 & r;
        try {
          pr(-1), o && t.length > 22 && Dy(n, t, 22, !1), e(r, i);
        } finally {
          pr(s);
        }
      }
      function fh(n, t, e) {
        !Fm() ||
          ((function Hx(n, t, e, r) {
            const i = e.directiveStart,
              s = e.directiveEnd;
            n.firstCreatePass || Gs(e, t), lt(r, t);
            const o = e.initialInputs;
            for (let a = i; a < s; a++) {
              const l = n.data[a],
                c = hn(l);
              c && qx(t, e, l);
              const u = Ws(t, n, a, e);
              lt(u, t),
                null !== o && Kx(0, a - i, u, l, 0, o),
                c && (Nt(e.index, t)[8] = u);
            }
          })(n, t, e, Pt(e, t)),
          128 == (128 & e.flags) &&
            (function $x(n, t, e) {
              const r = e.directiveStart,
                i = e.directiveEnd,
                s = e.index,
                o = (function fT() {
                  return z.lFrame.currentDirectiveIndex;
                })();
              try {
                pr(s);
                for (let a = r; a < i; a++) {
                  const l = n.data[a],
                    c = t[a];
                  Ju(a),
                    (null !== l.hostBindings ||
                      0 !== l.hostVars ||
                      null !== l.hostAttrs) &&
                      Jy(l, c);
                }
              } finally {
                pr(-1), Ju(o);
              }
            })(n, t, e));
      }
      function ph(n, t, e = Pt) {
        const r = t.localNames;
        if (null !== r) {
          let i = t.index + 1;
          for (let s = 0; s < r.length; s += 2) {
            const o = r[s + 1],
              a = -1 === o ? e(t, n) : n[o];
            n[i++] = a;
          }
        }
      }
      function qy(n) {
        const t = n.tView;
        return null === t || t.incompleteFirstPass
          ? (n.tView = gh(
              1,
              null,
              n.template,
              n.decls,
              n.vars,
              n.directiveDefs,
              n.pipeDefs,
              n.viewQuery,
              n.schemas,
              n.consts,
            ))
          : t;
      }
      function gh(n, t, e, r, i, s, o, a, l, c) {
        const u = 22 + r,
          d = u + i,
          h = (function Px(n, t) {
            const e = [];
            for (let r = 0; r < t; r++) e.push(r < n ? null : W);
            return e;
          })(u, d),
          f = "function" == typeof c ? c() : c;
        return (h[1] = {
          type: n,
          blueprint: h,
          template: e,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, u),
          bindingStartIndex: u,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof s ? s() : s,
          pipeRegistry: "function" == typeof o ? o() : o,
          firstChild: null,
          schemas: l,
          consts: f,
          incompleteFirstPass: !1,
        });
      }
      function Ky(n, t, e, r) {
        const i = iv(t);
        null === e
          ? i.push(r)
          : (i.push(e), n.firstCreatePass && sv(n).push(r, i.length - 1));
      }
      function Yy(n, t, e) {
        for (let r in n)
          if (n.hasOwnProperty(r)) {
            const i = n[r];
            (e = null === e ? {} : e).hasOwnProperty(r)
              ? e[r].push(t, i)
              : (e[r] = [t, i]);
          }
        return e;
      }
      function Zy(n, t) {
        const r = t.directiveEnd,
          i = n.data,
          s = t.attrs,
          o = [];
        let a = null,
          l = null;
        for (let c = t.directiveStart; c < r; c++) {
          const u = i[c],
            d = u.inputs,
            h = null === s || vy(t) ? null : Yx(d, s);
          o.push(h), (a = Yy(d, c, a)), (l = Yy(u.outputs, c, l));
        }
        null !== a &&
          (a.hasOwnProperty("class") && (t.flags |= 16),
          a.hasOwnProperty("style") && (t.flags |= 32)),
          (t.initialInputs = o),
          (t.inputs = a),
          (t.outputs = l);
      }
      function jt(n, t, e, r, i, s, o, a) {
        const l = Pt(t, e);
        let u,
          c = t.inputs;
        !a && null != c && (u = c[r])
          ? (Ch(n, e, u, r, i), Ba(t) && Qy(e, t.index))
          : 3 & t.type &&
            ((r = (function Vx(n) {
              return "class" === n
                ? "className"
                : "for" === n
                  ? "htmlFor"
                  : "formaction" === n
                    ? "formAction"
                    : "innerHtml" === n
                      ? "innerHTML"
                      : "readonly" === n
                        ? "readOnly"
                        : "tabindex" === n
                          ? "tabIndex"
                          : n;
            })(r)),
            (i = null != o ? o(i, t.value || "", r) : i),
            s.setProperty(l, r, i));
      }
      function Qy(n, t) {
        const e = Nt(t, n);
        16 & e[2] || (e[2] |= 32);
      }
      function mh(n, t, e, r) {
        let i = !1;
        if (Fm()) {
          const s = (function zx(n, t, e) {
              const r = n.directiveRegistry;
              let i = null;
              if (r)
                for (let s = 0; s < r.length; s++) {
                  const o = r[s];
                  by(e, o.selectors, !1) &&
                    (i || (i = []),
                    Za(Gs(e, t), n, o.type),
                    hn(o) ? (ev(n, e), i.unshift(o)) : i.push(o));
                }
              return i;
            })(n, t, e),
            o = null === r ? null : { "": -1 };
          if (null !== s) {
            (i = !0), tv(e, n.data.length, s.length);
            for (let u = 0; u < s.length; u++) {
              const d = s[u];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              l = !1,
              c = zi(n, t, s.length, null);
            for (let u = 0; u < s.length; u++) {
              const d = s[u];
              (e.mergedAttrs = qa(e.mergedAttrs, d.hostAttrs)),
                nv(n, e, t, c, d),
                Wx(c, d, o),
                null !== d.contentQueries && (e.flags |= 8),
                (null !== d.hostBindings ||
                  null !== d.hostAttrs ||
                  0 !== d.hostVars) &&
                  (e.flags |= 128);
              const h = d.type.prototype;
              !a &&
                (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) &&
                ((n.preOrderHooks || (n.preOrderHooks = [])).push(e.index),
                (a = !0)),
                !l &&
                  (h.ngOnChanges || h.ngDoCheck) &&
                  ((n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(
                    e.index,
                  ),
                  (l = !0)),
                c++;
            }
            Zy(n, e);
          }
          o &&
            (function Gx(n, t, e) {
              if (t) {
                const r = (n.localNames = []);
                for (let i = 0; i < t.length; i += 2) {
                  const s = e[t[i + 1]];
                  if (null == s) throw new C(-301, !1);
                  r.push(t[i], s);
                }
              }
            })(e, r, o);
        }
        return (e.mergedAttrs = qa(e.mergedAttrs, e.attrs)), i;
      }
      function Xy(n, t, e, r, i, s) {
        const o = s.hostBindings;
        if (o) {
          let a = n.hostBindingOpCodes;
          null === a && (a = n.hostBindingOpCodes = []);
          const l = ~t.index;
          (function Ux(n) {
            let t = n.length;
            for (; t > 0; ) {
              const e = n[--t];
              if ("number" == typeof e && e < 0) return e;
            }
            return 0;
          })(a) != l && a.push(l),
            a.push(r, i, o);
        }
      }
      function Jy(n, t) {
        null !== n.hostBindings && n.hostBindings(1, t);
      }
      function ev(n, t) {
        (t.flags |= 2), (n.components || (n.components = [])).push(t.index);
      }
      function Wx(n, t, e) {
        if (e) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) e[t.exportAs[r]] = n;
          hn(t) && (e[""] = n);
        }
      }
      function tv(n, t, e) {
        (n.flags |= 1),
          (n.directiveStart = t),
          (n.directiveEnd = t + e),
          (n.providerIndexes = t);
      }
      function nv(n, t, e, r, i) {
        n.data[r] = i;
        const s = i.factory || (i.factory = Br(i.type)),
          o = new $s(s, hn(i), _);
        (n.blueprint[r] = o),
          (e[r] = o),
          Xy(n, t, 0, r, zi(n, e, i.hostVars, W), i);
      }
      function qx(n, t, e) {
        const r = Pt(t, n),
          i = qy(e),
          s = n[10],
          o = vl(
            n,
            _l(
              n,
              i,
              null,
              e.onPush ? 32 : 16,
              r,
              t,
              s,
              s.createRenderer(r, e),
              null,
              null,
              null,
            ),
          );
        n[t.index] = o;
      }
      function An(n, t, e, r, i, s) {
        const o = Pt(n, t);
        !(function _h(n, t, e, r, i, s, o) {
          if (null == s) n.removeAttribute(t, i, e);
          else {
            const a = null == o ? G(s) : o(s, r || "", i);
            n.setAttribute(t, i, a, e);
          }
        })(t[K], o, s, n.value, e, r, i);
      }
      function Kx(n, t, e, r, i, s) {
        const o = s[t];
        if (null !== o) {
          const a = r.setInput;
          for (let l = 0; l < o.length; ) {
            const c = o[l++],
              u = o[l++],
              d = o[l++];
            null !== a ? r.setInput(e, d, c, u) : (e[u] = d);
          }
        }
      }
      function Yx(n, t) {
        let e = null,
          r = 0;
        for (; r < t.length; ) {
          const i = t[r];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              n.hasOwnProperty(i) &&
                (null === e && (e = []), e.push(i, n[i], t[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return e;
      }
      function rv(n, t, e, r) {
        return new Array(n, !0, !1, t, null, 0, r, e, null, null);
      }
      function Xx(n, t) {
        const e = Nt(t, n);
        if (Ha(e)) {
          const r = e[1];
          48 & e[2] ? yl(r, e, r.template, e[8]) : e[5] > 0 && yh(e);
        }
      }
      function yh(n) {
        for (let r = Ed(n); null !== r; r = Sd(r))
          for (let i = 10; i < r.length; i++) {
            const s = r[i];
            if (Ha(s))
              if (512 & s[2]) {
                const o = s[1];
                yl(o, s, o.template, s[8]);
              } else s[5] > 0 && yh(s);
          }
        const e = n[1].components;
        if (null !== e)
          for (let r = 0; r < e.length; r++) {
            const i = Nt(e[r], n);
            Ha(i) && i[5] > 0 && yh(i);
          }
      }
      function Jx(n, t) {
        const e = Nt(t, n),
          r = e[1];
        (function eO(n, t) {
          for (let e = t.length; e < n.blueprint.length; e++)
            t.push(n.blueprint[e]);
        })(r, e),
          hh(r, e, e[8]);
      }
      function vl(n, t) {
        return n[13] ? (n[14][4] = t) : (n[13] = t), (n[14] = t), t;
      }
      function vh(n) {
        for (; n; ) {
          n[2] |= 32;
          const t = ro(n);
          if (GA(n) && !t) return n;
          n = t;
        }
        return null;
      }
      function bl(n, t, e, r = !0) {
        const i = t[10];
        i.begin && i.begin();
        try {
          yl(n, t, n.template, e);
        } catch (o) {
          throw (r && av(t, o), o);
        } finally {
          i.end && i.end();
        }
      }
      function bh(n, t, e) {
        td(0), t(n, e);
      }
      function iv(n) {
        return n[7] || (n[7] = []);
      }
      function sv(n) {
        return n.cleanup || (n.cleanup = []);
      }
      function ov(n, t, e) {
        return (
          (null === n || hn(n)) &&
            (e = (function tT(n) {
              for (; Array.isArray(n); ) {
                if ("object" == typeof n[1]) return n;
                n = n[0];
              }
              return null;
            })(e[t.index])),
          e[K]
        );
      }
      function av(n, t) {
        const e = n[9],
          r = e ? e.get(Yn, null) : null;
        r && r.handleError(t);
      }
      function Ch(n, t, e, r, i) {
        for (let s = 0; s < e.length; ) {
          const o = e[s++],
            a = e[s++],
            l = t[o],
            c = n.data[o];
          null !== c.setInput ? c.setInput(l, i, r, a) : (l[a] = i);
        }
      }
      function Cl(n, t, e) {
        let r = e ? n.styles : null,
          i = e ? n.classes : null,
          s = 0;
        if (null !== t)
          for (let o = 0; o < t.length; o++) {
            const a = t[o];
            "number" == typeof a
              ? (s = a)
              : 1 == s
                ? (i = Nu(i, a))
                : 2 == s && (r = Nu(r, a + ": " + t[++o] + ";"));
          }
        e ? (n.styles = r) : (n.stylesWithoutHost = r),
          e ? (n.classes = i) : (n.classesWithoutHost = i);
      }
      function Dl(n, t, e, r, i = !1) {
        for (; null !== e; ) {
          const s = t[e.index];
          if ((null !== s && r.push(Ve(s)), dn(s)))
            for (let a = 10; a < s.length; a++) {
              const l = s[a],
                c = l[1].firstChild;
              null !== c && Dl(l[1], l, c, r);
            }
          const o = e.type;
          if (8 & o) Dl(n, t, e.child, r);
          else if (32 & o) {
            const a = wd(e, t);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & o) {
            const a = z_(t, e);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = ro(t[16]);
              Dl(l[1], l, a, r, !0);
            }
          }
          e = i ? e.projectionNext : e.next;
        }
        return r;
      }
      class co {
        constructor(t, e) {
          (this._lView = t),
            (this._cdRefInjectingView = e),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            e = t[1];
          return Dl(e, t, e.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (dn(t)) {
              const e = t[8],
                r = e ? e.indexOf(this) : -1;
              r > -1 && (Td(t, r), Xa(e, r));
            }
            this._attachedToViewContainer = !1;
          }
          P_(this._lView[1], this._lView);
        }
        onDestroy(t) {
          Ky(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          vh(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          bl(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function xI(n, t) {
              io(n, t, t[K], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class tO extends co {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          bl(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Dh extends Gr {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const e = be(t);
          return new uo(e, this.ngModule);
        }
      }
      function lv(n) {
        const t = [];
        for (let e in n)
          n.hasOwnProperty(e) && t.push({ propName: n[e], templateName: e });
        return t;
      }
      class rO {
        constructor(t, e) {
          (this.injector = t), (this.parentInjector = e);
        }
        get(t, e, r) {
          const i = this.injector.get(t, Kd, r);
          return i !== Kd || e === Kd ? i : this.parentInjector.get(t, e, r);
        }
      }
      class uo extends py {
        constructor(t, e) {
          super(),
            (this.componentDef = t),
            (this.ngModule = e),
            (this.componentType = t.type),
            (this.selector = (function nx(n) {
              return n.map(tx).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!e);
        }
        get inputs() {
          return lv(this.componentDef.inputs);
        }
        get outputs() {
          return lv(this.componentDef.outputs);
        }
        create(t, e, r, i) {
          let s = (i = i || this.ngModule) instanceof mr ? i : i?.injector;
          s &&
            null !== this.componentDef.getStandaloneInjector &&
            (s = this.componentDef.getStandaloneInjector(s) || s);
          const o = s ? new rO(t, s) : t,
            a = o.get(lo, null);
          if (null === a) throw new C(407, !1);
          const l = o.get(PR, null),
            c = a.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function Nx(n, t, e) {
                  return n.selectRootElement(t, e === cn.ShadowDom);
                })(c, r, this.componentDef.encapsulation)
              : Ad(
                  c,
                  u,
                  (function nO(n) {
                    const t = n.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(u),
                ),
            h = this.componentDef.onPush ? 288 : 272,
            f = gh(0, null, null, 1, 0, null, null, null, null, null),
            p = _l(null, f, null, h, null, null, a, c, l, o, null);
          let g, y;
          nd(p);
          try {
            const b = (function oO(n, t, e, r, i, s) {
              const o = e[1];
              e[22] = n;
              const l = $i(o, 22, 2, "#host", null),
                c = (l.mergedAttrs = t.hostAttrs);
              null !== c &&
                (Cl(l, c, !0),
                null !== n &&
                  (Wa(i, n, c),
                  null !== l.classes && Fd(i, n, l.classes),
                  null !== l.styles && W_(i, n, l.styles)));
              const u = r.createRenderer(n, t),
                d = _l(
                  e,
                  qy(t),
                  null,
                  t.onPush ? 32 : 16,
                  e[22],
                  l,
                  r,
                  u,
                  s || null,
                  null,
                  null,
                );
              return (
                o.firstCreatePass &&
                  (Za(Gs(l, e), o, t.type), ev(o, l), tv(l, e.length, 1)),
                vl(e, d),
                (e[22] = d)
              );
            })(d, this.componentDef, p, a, c);
            if (d)
              if (r) Wa(c, d, ["ng-version", NR.full]);
              else {
                const { attrs: M, classes: v } = (function rx(n) {
                  const t = [],
                    e = [];
                  let r = 1,
                    i = 2;
                  for (; r < n.length; ) {
                    let s = n[r];
                    if ("string" == typeof s)
                      2 === i
                        ? "" !== s && t.push(s, n[++r])
                        : 8 === i && e.push(s);
                    else {
                      if (!fn(i)) break;
                      i = s;
                    }
                    r++;
                  }
                  return { attrs: t, classes: e };
                })(this.componentDef.selectors[0]);
                M && Wa(c, d, M), v && v.length > 0 && Fd(c, d, v.join(" "));
              }
            if (((y = Yu(f, 22)), void 0 !== e)) {
              const M = (y.projection = []);
              for (let v = 0; v < this.ngContentSelectors.length; v++) {
                const T = e[v];
                M.push(null != T ? Array.from(T) : null);
              }
            }
            (g = (function aO(n, t, e, r) {
              const i = e[1],
                s = (function jx(n, t, e) {
                  const r = Ge();
                  n.firstCreatePass &&
                    (e.providersResolver && e.providersResolver(e),
                    nv(n, r, t, zi(n, t, 1, null), e),
                    Zy(n, r));
                  const i = Ws(t, n, r.directiveStart, r);
                  lt(i, t);
                  const s = Pt(r, t);
                  return s && lt(s, t), i;
                })(i, e, t);
              if (((n[8] = e[8] = s), null !== r)) for (const a of r) a(s, t);
              if (t.contentQueries) {
                const a = Ge();
                t.contentQueries(1, s, a.directiveStart);
              }
              const o = Ge();
              return (
                !i.firstCreatePass ||
                  (null === t.hostBindings && null === t.hostAttrs) ||
                  (pr(o.index),
                  Xy(e[1], o, 0, o.directiveStart, o.directiveEnd, t),
                  Jy(t, s)),
                s
              );
            })(b, this.componentDef, p, [lO])),
              hh(f, p, null);
          } finally {
            rd();
          }
          return new sO(this.componentType, g, ji(y, p), p, y);
        }
      }
      class sO extends class IR {} {
        constructor(t, e, r, i, s) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = s),
            (this.instance = e),
            (this.hostView = this.changeDetectorRef = new tO(i)),
            (this.componentType = t);
        }
        setInput(t, e) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[t])) {
            const s = this._rootLView;
            Ch(s[1], s, i, t, e), Qy(s, this._tNode.index);
          }
        }
        get injector() {
          return new Ii(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function lO() {
        const n = Ge();
        $a(D()[1], n);
      }
      function ne(n) {
        let t = (function cv(n) {
            return Object.getPrototypeOf(n.prototype).constructor;
          })(n.type),
          e = !0;
        const r = [n];
        for (; t; ) {
          let i;
          if (hn(n)) i = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new C(903, !1);
            i = t.ɵdir;
          }
          if (i) {
            if (e) {
              r.push(i);
              const o = n;
              (o.inputs = wh(n.inputs)),
                (o.declaredInputs = wh(n.declaredInputs)),
                (o.outputs = wh(n.outputs));
              const a = i.hostBindings;
              a && hO(n, a);
              const l = i.viewQuery,
                c = i.contentQueries;
              if (
                (l && uO(n, l),
                c && dO(n, c),
                Pu(n.inputs, i.inputs),
                Pu(n.declaredInputs, i.declaredInputs),
                Pu(n.outputs, i.outputs),
                hn(i) && i.data.animation)
              ) {
                const u = n.data;
                u.animation = (u.animation || []).concat(i.data.animation);
              }
            }
            const s = i.features;
            if (s)
              for (let o = 0; o < s.length; o++) {
                const a = s[o];
                a && a.ngInherit && a(n), a === ne && (e = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function cO(n) {
          let t = 0,
            e = null;
          for (let r = n.length - 1; r >= 0; r--) {
            const i = n[r];
            (i.hostVars = t += i.hostVars),
              (i.hostAttrs = qa(i.hostAttrs, (e = qa(e, i.hostAttrs))));
          }
        })(r);
      }
      function wh(n) {
        return n === bi ? {} : n === fe ? [] : n;
      }
      function uO(n, t) {
        const e = n.viewQuery;
        n.viewQuery = e
          ? (r, i) => {
              t(r, i), e(r, i);
            }
          : t;
      }
      function dO(n, t) {
        const e = n.contentQueries;
        n.contentQueries = e
          ? (r, i, s) => {
              t(r, i, s), e(r, i, s);
            }
          : t;
      }
      function hO(n, t) {
        const e = n.hostBindings;
        n.hostBindings = e
          ? (r, i) => {
              t(r, i), e(r, i);
            }
          : t;
      }
      let wl = null;
      function Wr() {
        if (!wl) {
          const n = Ee.Symbol;
          if (n && n.iterator) wl = n.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let e = 0; e < t.length; ++e) {
              const r = t[e];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (wl = r);
            }
          }
        }
        return wl;
      }
      function ho(n) {
        return (
          !!Eh(n) && (Array.isArray(n) || (!(n instanceof Map) && Wr() in n))
        );
      }
      function Eh(n) {
        return null !== n && ("function" == typeof n || "object" == typeof n);
      }
      function ct(n, t, e) {
        return !Object.is(n[t], e) && ((n[t] = e), !0);
      }
      function et(n, t, e, r) {
        const i = D();
        return ct(i, Mi(), t) && (se(), An(Re(), i, n, t, e, r)), et;
      }
      function Xe(n, t, e, r, i, s, o, a) {
        const l = D(),
          c = se(),
          u = n + 22,
          d = c.firstCreatePass
            ? (function bO(n, t, e, r, i, s, o, a, l) {
                const c = t.consts,
                  u = $i(t, n, 4, o || null, fr(c, a));
                mh(t, e, u, fr(c, l)), $a(t, u);
                const d = (u.tViews = gh(
                  2,
                  u,
                  r,
                  i,
                  s,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  c,
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, u),
                    (d.queries = t.queries.embeddedTView(u))),
                  u
                );
              })(u, c, l, t, e, r, i, s, o)
            : c.data[u];
        En(d, !1);
        const h = l[K].createComment("");
        il(c, l, h, d),
          lt(h, l),
          vl(l, (l[u] = rv(h, l, h, d))),
          ja(d) && fh(c, l, d),
          null != o && ph(l, d, a);
      }
      function po(n) {
        return Si(
          (function uT() {
            return z.lFrame.contextLView;
          })(),
          22 + n,
        );
      }
      function $(n, t, e) {
        const r = D();
        return ct(r, Mi(), t) && jt(se(), Re(), r, n, t, r[K], e, !1), $;
      }
      function Sh(n, t, e, r, i) {
        const o = i ? "class" : "style";
        Ch(n, e, t.inputs[o], o, r);
      }
      function E(n, t, e, r) {
        const i = D(),
          s = se(),
          o = 22 + n,
          a = i[K],
          l = (i[o] = Ad(
            a,
            t,
            (function bT() {
              return z.lFrame.currentNamespace;
            })(),
          )),
          c = s.firstCreatePass
            ? (function DO(n, t, e, r, i, s, o) {
                const a = t.consts,
                  c = $i(t, n, 2, i, fr(a, s));
                return (
                  mh(t, e, c, fr(a, o)),
                  null !== c.attrs && Cl(c, c.attrs, !1),
                  null !== c.mergedAttrs && Cl(c, c.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, c),
                  c
                );
              })(o, s, i, 0, t, e, r)
            : s.data[o];
        En(c, !0);
        const u = c.mergedAttrs;
        null !== u && Wa(a, l, u);
        const d = c.classes;
        null !== d && Fd(a, l, d);
        const h = c.styles;
        return (
          null !== h && W_(a, l, h),
          64 != (64 & c.flags) && il(s, i, l, c),
          0 ===
            (function sT() {
              return z.lFrame.elementDepthCount;
            })() && lt(l, i),
          (function oT() {
            z.lFrame.elementDepthCount++;
          })(),
          ja(c) &&
            (fh(s, i, c),
            (function Wy(n, t, e) {
              if (zu(t)) {
                const i = t.directiveEnd;
                for (let s = t.directiveStart; s < i; s++) {
                  const o = n.data[s];
                  o.contentQueries && o.contentQueries(1, e[s], s);
                }
              }
            })(s, c, i)),
          null !== r && ph(i, c),
          E
        );
      }
      function S() {
        let n = Ge();
        Qu() ? Xu() : ((n = n.parent), En(n, !1));
        const t = n;
        !(function aT() {
          z.lFrame.elementDepthCount--;
        })();
        const e = se();
        return (
          e.firstCreatePass && ($a(e, n), zu(n) && e.queries.elementEnd(n)),
          null != t.classesWithoutHost &&
            (function ST(n) {
              return 0 != (16 & n.flags);
            })(t) &&
            Sh(e, t, D(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function MT(n) {
              return 0 != (32 & n.flags);
            })(t) &&
            Sh(e, t, D(), t.stylesWithoutHost, !1),
          S
        );
      }
      function X(n, t, e, r) {
        return E(n, t, e, r), S(), X;
      }
      function es() {
        return D();
      }
      function go(n) {
        return !!n && "function" == typeof n.then;
      }
      const Th = function bv(n) {
        return !!n && "function" == typeof n.subscribe;
      };
      function oe(n, t, e, r) {
        const i = D(),
          s = se(),
          o = Ge();
        return Cv(s, i, i[K], o, n, t, 0, r), oe;
      }
      function Ih(n, t) {
        const e = Ge(),
          r = D(),
          i = se();
        return Cv(i, r, ov(ed(i.data), e, r), e, n, t), Ih;
      }
      function Cv(n, t, e, r, i, s, o, a) {
        const l = ja(r),
          u = n.firstCreatePass && sv(n),
          d = t[8],
          h = iv(t);
        let f = !0;
        if (3 & r.type || a) {
          const y = Pt(r, t),
            b = a ? a(y) : y,
            M = h.length,
            v = a ? (Q) => a(Ve(Q[r.index])) : r.index;
          let T = null;
          if (
            (!a &&
              l &&
              (T = (function EO(n, t, e, r) {
                const i = n.cleanup;
                if (null != i)
                  for (let s = 0; s < i.length - 1; s += 2) {
                    const o = i[s];
                    if (o === e && i[s + 1] === r) {
                      const a = t[7],
                        l = i[s + 2];
                      return a.length > l ? a[l] : null;
                    }
                    "string" == typeof o && (s += 2);
                  }
                return null;
              })(n, t, i, r.index)),
            null !== T)
          )
            ((T.__ngLastListenerFn__ || T).__ngNextListenerFn__ = s),
              (T.__ngLastListenerFn__ = s),
              (f = !1);
          else {
            s = wv(r, t, d, s, !1);
            const Q = e.listen(b, i, s);
            h.push(s, Q), u && u.push(i, v, M, M + 1);
          }
        } else s = wv(r, t, d, s, !1);
        const p = r.outputs;
        let g;
        if (f && null !== p && (g = p[i])) {
          const y = g.length;
          if (y)
            for (let b = 0; b < y; b += 2) {
              const ie = t[g[b]][g[b + 1]].subscribe(s),
                Oe = h.length;
              h.push(s, ie), u && u.push(i, r.index, Oe, -(Oe + 1));
            }
        }
      }
      function Dv(n, t, e, r) {
        try {
          return !1 !== e(r);
        } catch (i) {
          return av(n, i), !1;
        }
      }
      function wv(n, t, e, r, i) {
        return function s(o) {
          if (o === Function) return r;
          vh(2 & n.flags ? Nt(n.index, t) : t);
          let l = Dv(t, 0, r, o),
            c = s.__ngNextListenerFn__;
          for (; c; ) (l = Dv(t, 0, c, o) && l), (c = c.__ngNextListenerFn__);
          return i && !1 === l && (o.preventDefault(), (o.returnValue = !1)), l;
        };
      }
      function tt(n = 1) {
        return (function gT(n) {
          return (z.lFrame.contextLView = (function mT(n, t) {
            for (; n > 0; ) (t = t[15]), n--;
            return t;
          })(n, z.lFrame.contextLView))[8];
        })(n);
      }
      function SO(n, t) {
        let e = null;
        const r = (function QR(n) {
          const t = n.attrs;
          if (null != t) {
            const e = t.indexOf(5);
            if (0 == (1 & e)) return t[e + 1];
          }
          return null;
        })(n);
        for (let i = 0; i < t.length; i++) {
          const s = t[i];
          if ("*" !== s) {
            if (null === r ? by(n, s, !0) : ex(r, s)) return i;
          } else e = i;
        }
        return e;
      }
      function mo(n) {
        const t = D()[16][6];
        if (!t.projection) {
          const r = (t.projection = Ys(n ? n.length : 1, null)),
            i = r.slice();
          let s = t.child;
          for (; null !== s; ) {
            const o = n ? SO(s, n) : 0;
            null !== o &&
              (i[o] ? (i[o].projectionNext = s) : (r[o] = s), (i[o] = s)),
              (s = s.next);
          }
        }
      }
      function _o(n, t = 0, e) {
        const r = D(),
          i = se(),
          s = $i(i, 22 + n, 16, null, e || null);
        null === s.projection && (s.projection = t),
          Xu(),
          64 != (64 & s.flags) &&
            (function BI(n, t, e) {
              G_(t[K], 0, t, e, N_(n, e, t), j_(e.parent || t[6], e, t));
            })(i, r, s);
      }
      function kv(n, t, e, r, i) {
        const s = n[e + 1],
          o = null === t;
        let a = r ? pn(s) : Qn(s),
          l = !1;
        for (; 0 !== a && (!1 === l || o); ) {
          const u = n[a + 1];
          TO(n[a], t) && ((l = !0), (n[a + 1] = r ? rh(u) : th(u))),
            (a = r ? pn(u) : Qn(u));
        }
        l && (n[e + 1] = r ? th(s) : rh(s));
      }
      function TO(n, t) {
        return (
          null === n ||
          null == t ||
          (Array.isArray(n) ? n[1] : n) === t ||
          (!(!Array.isArray(n) || "string" != typeof t) && Pi(n, t) >= 0)
        );
      }
      function Jn(n, t) {
        return (
          (function gn(n, t, e, r) {
            const i = D(),
              s = se(),
              o = (function zn(n) {
                const t = z.lFrame,
                  e = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + n), e;
              })(2);
            s.firstUpdatePass &&
              (function Hv(n, t, e, r) {
                const i = n.data;
                if (null === i[e + 1]) {
                  const s = i[mt()],
                    o = (function Uv(n, t) {
                      return t >= n.expandoStartIndex;
                    })(n, e);
                  (function Wv(n, t) {
                    return 0 != (n.flags & (t ? 16 : 32));
                  })(s, r) &&
                    null === t &&
                    !o &&
                    (t = !1),
                    (t = (function LO(n, t, e, r) {
                      const i = ed(n);
                      let s = r ? t.residualClasses : t.residualStyles;
                      if (null === i)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((e = yo((e = xh(null, n, t, e, r)), t.attrs, r)),
                          (s = null));
                      else {
                        const o = t.directiveStylingLast;
                        if (-1 === o || n[o] !== i)
                          if (((e = xh(i, n, t, e, r)), null === s)) {
                            let l = (function VO(n, t, e) {
                              const r = e ? t.classBindings : t.styleBindings;
                              if (0 !== Qn(r)) return n[pn(r)];
                            })(n, t, r);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = xh(null, n, t, l[1], r)),
                              (l = yo(l, t.attrs, r)),
                              (function BO(n, t, e, r) {
                                n[pn(e ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(n, t, r, l));
                          } else
                            s = (function jO(n, t, e) {
                              let r;
                              const i = t.directiveEnd;
                              for (
                                let s = 1 + t.directiveStylingLast;
                                s < i;
                                s++
                              )
                                r = yo(r, n[s].hostAttrs, e);
                              return yo(r, t.attrs, e);
                            })(n, t, r);
                      }
                      return (
                        void 0 !== s &&
                          (r
                            ? (t.residualClasses = s)
                            : (t.residualStyles = s)),
                        e
                      );
                    })(i, s, t, r)),
                    (function MO(n, t, e, r, i, s) {
                      let o = s ? t.classBindings : t.styleBindings,
                        a = pn(o),
                        l = Qn(o);
                      n[r] = e;
                      let u,
                        c = !1;
                      if (Array.isArray(e)) {
                        const d = e;
                        (u = d[1]), (null === u || Pi(d, u) > 0) && (c = !0);
                      } else u = e;
                      if (i)
                        if (0 !== l) {
                          const h = pn(n[a + 1]);
                          (n[r + 1] = pl(h, a)),
                            0 !== h && (n[h + 1] = nh(n[h + 1], r)),
                            (n[a + 1] = (function Dx(n, t) {
                              return (131071 & n) | (t << 17);
                            })(n[a + 1], r));
                        } else
                          (n[r + 1] = pl(a, 0)),
                            0 !== a && (n[a + 1] = nh(n[a + 1], r)),
                            (a = r);
                      else
                        (n[r + 1] = pl(l, 0)),
                          0 === a ? (a = r) : (n[l + 1] = nh(n[l + 1], r)),
                          (l = r);
                      c && (n[r + 1] = th(n[r + 1])),
                        kv(n, u, r, !0),
                        kv(n, u, r, !1),
                        (function AO(n, t, e, r, i) {
                          const s = i ? n.residualClasses : n.residualStyles;
                          null != s &&
                            "string" == typeof t &&
                            Pi(s, t) >= 0 &&
                            (e[r + 1] = rh(e[r + 1]));
                        })(t, u, n, r, s),
                        (o = pl(a, l)),
                        s ? (t.classBindings = o) : (t.styleBindings = o);
                    })(i, s, t, e, o, r);
                }
              })(s, n, o, r),
              t !== W &&
                ct(i, o, t) &&
                (function zv(n, t, e, r, i, s, o, a) {
                  if (!(3 & t.type)) return;
                  const l = n.data,
                    c = l[a + 1];
                  Sl(
                    (function Ny(n) {
                      return 1 == (1 & n);
                    })(c)
                      ? Gv(l, t, e, i, Qn(c), o)
                      : void 0,
                  ) ||
                    (Sl(s) ||
                      ((function Py(n) {
                        return 2 == (2 & n);
                      })(c) &&
                        (s = Gv(l, null, e, i, a, o))),
                    (function UI(n, t, e, r, i) {
                      if (t) i ? n.addClass(e, r) : n.removeClass(e, r);
                      else {
                        let s = -1 === r.indexOf("-") ? void 0 : Mt.DashCase;
                        null == i
                          ? n.removeStyle(e, r, s)
                          : ("string" == typeof i &&
                              i.endsWith("!important") &&
                              ((i = i.slice(0, -10)), (s |= Mt.Important)),
                            n.setStyle(e, r, i, s));
                      }
                    })(r, o, Ua(mt(), e), i, s));
                })(
                  s,
                  s.data[mt()],
                  i,
                  i[K],
                  n,
                  (i[o + 1] = (function $O(n, t) {
                    return (
                      null == n ||
                        ("string" == typeof t
                          ? (n += t)
                          : "object" == typeof n && (n = De(Bt(n)))),
                      n
                    );
                  })(t, e)),
                  r,
                  o,
                );
          })(n, t, null, !0),
          Jn
        );
      }
      function xh(n, t, e, r, i) {
        let s = null;
        const o = e.directiveEnd;
        let a = e.directiveStylingLast;
        for (
          -1 === a ? (a = e.directiveStart) : a++;
          a < o && ((s = t[a]), (r = yo(r, s.hostAttrs, i)), s !== n);

        )
          a++;
        return null !== n && (e.directiveStylingLast = a), r;
      }
      function yo(n, t, e) {
        const r = e ? 1 : 2;
        let i = -1;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const o = t[s];
            "number" == typeof o
              ? (i = o)
              : i === r &&
                (Array.isArray(n) || (n = void 0 === n ? [] : ["", n]),
                Vt(n, o, !!e || t[++s]));
          }
        return void 0 === n ? null : n;
      }
      function Gv(n, t, e, r, i, s) {
        const o = null === t;
        let a;
        for (; i > 0; ) {
          const l = n[i],
            c = Array.isArray(l),
            u = c ? l[1] : l,
            d = null === u;
          let h = e[i + 1];
          h === W && (h = d ? fe : void 0);
          let f = d ? hd(h, r) : u === r ? h : void 0;
          if ((c && !Sl(f) && (f = hd(l, r)), Sl(f) && ((a = f), o))) return a;
          const p = n[i + 1];
          i = o ? pn(p) : Qn(p);
        }
        if (null !== t) {
          let l = s ? t.residualClasses : t.residualStyles;
          null != l && (a = hd(l, r));
        }
        return a;
      }
      function Sl(n) {
        return void 0 !== n;
      }
      function x(n, t = "") {
        const e = D(),
          r = se(),
          i = n + 22,
          s = r.firstCreatePass ? $i(r, i, 1, t, null) : r.data[i],
          o = (e[i] = (function Md(n, t) {
            return n.createText(t);
          })(e[K], t));
        il(r, e, o, s), En(s, !1);
      }
      function nt(n) {
        return br("", n, ""), nt;
      }
      function br(n, t, e) {
        const r = D(),
          i = (function Wi(n, t, e, r) {
            return ct(n, Mi(), e) ? t + G(e) + r : W;
          })(r, n, t, e);
        return (
          i !== W &&
            (function Xn(n, t, e) {
              const r = Ua(t, n);
              !(function k_(n, t, e) {
                n.setValue(t, e);
              })(n[K], r, e);
            })(r, mt(), i),
          br
        );
      }
      function Oh(n, t, e) {
        const r = D();
        return ct(r, Mi(), t) && jt(se(), Re(), r, n, t, r[K], e, !0), Oh;
      }
      function kh(n, t, e) {
        const r = D();
        if (ct(r, Mi(), t)) {
          const s = se(),
            o = Re();
          jt(s, o, r, n, t, ov(ed(s.data), o, r), e, !0);
        }
        return kh;
      }
      const rs = "en-US";
      let hb = rs;
      function Nh(n, t, e, r, i) {
        if (((n = H(n)), Array.isArray(n)))
          for (let s = 0; s < n.length; s++) Nh(n[s], t, e, r, i);
        else {
          const s = se(),
            o = D();
          let a = zr(n) ? n : H(n.provide),
            l = fy(n);
          const c = Ge(),
            u = 1048575 & c.providerIndexes,
            d = c.directiveStart,
            h = c.providerIndexes >> 20;
          if (zr(n) || !n.multi) {
            const f = new $s(l, i, _),
              p = Vh(a, t, i ? u : u + h, d);
            -1 === p
              ? (Za(Gs(c, o), s, a),
                Lh(s, n, t.length),
                t.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                e.push(f),
                o.push(f))
              : ((e[p] = f), (o[p] = f));
          } else {
            const f = Vh(a, t, u + h, d),
              p = Vh(a, t, u, u + h),
              g = f >= 0 && e[f],
              y = p >= 0 && e[p];
            if ((i && !y) || (!i && !g)) {
              Za(Gs(c, o), s, a);
              const b = (function aF(n, t, e, r, i) {
                const s = new $s(n, e, _);
                return (
                  (s.multi = []),
                  (s.index = t),
                  (s.componentProviders = 0),
                  Lb(s, i, r && !e),
                  s
                );
              })(i ? oF : sF, e.length, i, r, l);
              !i && y && (e[p].providerFactory = b),
                Lh(s, n, t.length, 0),
                t.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                e.push(b),
                o.push(b);
            } else Lh(s, n, f > -1 ? f : p, Lb(e[i ? p : f], l, !i && r));
            !i && r && y && e[p].componentProviders++;
          }
        }
      }
      function Lh(n, t, e, r) {
        const i = zr(t),
          s = (function CR(n) {
            return !!n.useClass;
          })(t);
        if (i || s) {
          const l = (s ? H(t.useClass) : t).prototype.ngOnDestroy;
          if (l) {
            const c = n.destroyHooks || (n.destroyHooks = []);
            if (!i && t.multi) {
              const u = c.indexOf(e);
              -1 === u ? c.push(e, [r, l]) : c[u + 1].push(r, l);
            } else c.push(e, l);
          }
        }
      }
      function Lb(n, t, e) {
        return e && n.componentProviders++, n.multi.push(t) - 1;
      }
      function Vh(n, t, e, r) {
        for (let i = e; i < r; i++) if (t[i] === n) return i;
        return -1;
      }
      function sF(n, t, e, r) {
        return Bh(this.multi, []);
      }
      function oF(n, t, e, r) {
        const i = this.multi;
        let s;
        if (this.providerFactory) {
          const o = this.providerFactory.componentProviders,
            a = Ws(e, e[1], this.providerFactory.index, r);
          (s = a.slice(0, o)), Bh(i, s);
          for (let l = o; l < a.length; l++) s.push(a[l]);
        } else (s = []), Bh(i, s);
        return s;
      }
      function Bh(n, t) {
        for (let e = 0; e < n.length; e++) t.push((0, n[e])());
        return t;
      }
      function Ae(n, t = []) {
        return (e) => {
          e.providersResolver = (r, i) =>
            (function iF(n, t, e) {
              const r = se();
              if (r.firstCreatePass) {
                const i = hn(n);
                Nh(e, r.data, r.blueprint, i, !0),
                  Nh(t, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(n) : n, t);
        };
      }
      class Yr {}
      class Vb {}
      class Bb extends Yr {
        constructor(t, e) {
          super(),
            (this._parent = e),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Dh(this));
          const r = kt(t);
          (this._bootstrapComponents = Zn(r.bootstrap)),
            (this._r3Injector = Ay(
              t,
              e,
              [
                { provide: Yr, useValue: this },
                { provide: Gr, useValue: this.componentFactoryResolver },
              ],
              De(t),
              new Set(["environment"]),
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((e) => e()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class jh extends Vb {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Bb(this.moduleType, t);
        }
      }
      class cF extends Yr {
        constructor(t, e, r) {
          super(),
            (this.componentFactoryResolver = new Dh(this)),
            (this.instance = null);
          const i = new hy(
            [
              ...t,
              { provide: Yr, useValue: this },
              { provide: Gr, useValue: this.componentFactoryResolver },
            ],
            e || dl(),
            r,
            new Set(["environment"]),
          );
          (this.injector = i), i.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function Rl(n, t, e = null) {
        return new cF(n, t, e).injector;
      }
      let uF = (() => {
        class n {
          constructor(e) {
            (this._injector = e), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(e) {
            if (!e.standalone) return null;
            if (!this.cachedInjectors.has(e.id)) {
              const r = ly(0, e.type),
                i =
                  r.length > 0
                    ? Rl([r], this._injector, `Standalone[${e.type.name}]`)
                    : null;
              this.cachedInjectors.set(e.id, i);
            }
            return this.cachedInjectors.get(e.id);
          }
          ngOnDestroy() {
            try {
              for (const e of this.cachedInjectors.values())
                null !== e && e.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (n.ɵprov = A({
            token: n,
            providedIn: "environment",
            factory: () => new n(m(mr)),
          })),
          n
        );
      })();
      function jb(n) {
        n.getStandaloneInjector = (t) =>
          t.get(uF).getOrCreateStandaloneInjector(n);
      }
      function Hh(n, t, e, r) {
        return qb(D(), gt(), n, t, e, r);
      }
      function qb(n, t, e, r, i, s) {
        const o = t + e;
        return ct(n, o, i)
          ? (function Tn(n, t, e) {
              return (n[t] = e);
            })(n, o + 1, s ? r.call(s, i) : r(i))
          : (function Eo(n, t) {
              const e = n[t];
              return e === W ? void 0 : e;
            })(n, o + 1);
      }
      function xl(n, t) {
        const e = se();
        let r;
        const i = n + 22;
        e.firstCreatePass
          ? ((r = (function TF(n, t) {
              if (t)
                for (let e = t.length - 1; e >= 0; e--) {
                  const r = t[e];
                  if (n === r.name) return r;
                }
            })(t, e.pipeRegistry)),
            (e.data[i] = r),
            r.onDestroy &&
              (e.destroyHooks || (e.destroyHooks = [])).push(i, r.onDestroy))
          : (r = e.data[i]);
        const s = r.factory || (r.factory = Br(r.type)),
          o = Zt(_);
        try {
          const a = Ka(!1),
            l = s();
          return (
            Ka(a),
            (function CO(n, t, e, r) {
              e >= n.data.length &&
                ((n.data[e] = null), (n.blueprint[e] = null)),
                (t[e] = r);
            })(e, D(), i, l),
            l
          );
        } finally {
          Zt(o);
        }
      }
      function Ol(n, t, e) {
        const r = n + 22,
          i = D(),
          s = Si(i, r);
        return (function So(n, t) {
          return n[1].data[t].pure;
        })(i, r)
          ? qb(i, gt(), t, s.transform, e, s)
          : s.transform(e);
      }
      function $h(n) {
        return (t) => {
          setTimeout(n, void 0, t);
        };
      }
      const ae = class kF extends de {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, e, r) {
          let i = t,
            s = e || (() => null),
            o = r;
          if (t && "object" == typeof t) {
            const l = t;
            (i = l.next?.bind(l)),
              (s = l.error?.bind(l)),
              (o = l.complete?.bind(l));
          }
          this.__isAsync && ((s = $h(s)), i && (i = $h(i)), o && (o = $h(o)));
          const a = super.subscribe({ next: i, error: s, complete: o });
          return t instanceof ue && t.add(a), a;
        }
      };
      function FF() {
        return this._results[Wr()]();
      }
      class is {
        constructor(t = !1) {
          (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const e = Wr(),
            r = is.prototype;
          r[e] || (r[e] = FF);
        }
        get changes() {
          return this._changes || (this._changes = new ae());
        }
        get(t) {
          return this._results[t];
        }
        map(t) {
          return this._results.map(t);
        }
        filter(t) {
          return this._results.filter(t);
        }
        find(t) {
          return this._results.find(t);
        }
        reduce(t, e) {
          return this._results.reduce(t, e);
        }
        forEach(t) {
          this._results.forEach(t);
        }
        some(t) {
          return this._results.some(t);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(t, e) {
          const r = this;
          r.dirty = !1;
          const i = Lt(t);
          (this._changesDetected = !(function NT(n, t, e) {
            if (n.length !== t.length) return !1;
            for (let r = 0; r < n.length; r++) {
              let i = n[r],
                s = t[r];
              if ((e && ((i = e(i)), (s = e(s))), s !== i)) return !1;
            }
            return !0;
          })(r._results, i, e)) &&
            ((r._results = i),
            (r.length = i.length),
            (r.last = i[this.length - 1]),
            (r.first = i[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let _n = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = LF), n;
      })();
      const PF = _n,
        NF = class extends PF {
          constructor(t, e, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = e),
              (this.elementRef = r);
          }
          createEmbeddedView(t, e) {
            const r = this._declarationTContainer.tViews,
              i = _l(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                e || null,
              );
            i[17] = this._declarationLView[this._declarationTContainer.index];
            const o = this._declarationLView[19];
            return (
              null !== o && (i[19] = o.createEmbeddedView(r)),
              hh(r, i, t),
              new co(i)
            );
          }
        };
      function LF() {
        return kl(Ge(), D());
      }
      function kl(n, t) {
        return 4 & n.type ? new NF(t, n, ji(n, t)) : null;
      }
      let Ut = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = VF), n;
      })();
      function VF() {
        return eC(Ge(), D());
      }
      const BF = Ut,
        Xb = class extends BF {
          constructor(t, e, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = e),
              (this._hostLView = r);
          }
          get element() {
            return ji(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Ii(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Ya(this._hostTNode, this._hostLView);
            if (Zm(t)) {
              const e = Ti(t, this._hostLView),
                r = Ai(t);
              return new Ii(e[1].data[r + 8], e);
            }
            return new Ii(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const e = Jb(this._lContainer);
            return (null !== e && e[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, e, r) {
            let i, s;
            "number" == typeof r
              ? (i = r)
              : null != r && ((i = r.index), (s = r.injector));
            const o = t.createEmbeddedView(e || {}, s);
            return this.insert(o, i), o;
          }
          createComponent(t, e, r, i, s) {
            const o =
              t &&
              !(function Ks(n) {
                return "function" == typeof n;
              })(t);
            let a;
            if (o) a = e;
            else {
              const d = e || {};
              (a = d.index),
                (r = d.injector),
                (i = d.projectableNodes),
                (s = d.environmentInjector || d.ngModuleRef);
            }
            const l = o ? t : new uo(be(t)),
              c = r || this.parentInjector;
            if (!s && null == l.ngModule) {
              const h = (o ? c : this.parentInjector).get(mr, null);
              h && (s = h);
            }
            const u = l.create(c, i, void 0, s);
            return this.insert(u.hostView, a), u;
          }
          insert(t, e) {
            const r = t._lView,
              i = r[1];
            if (
              (function iT(n) {
                return dn(n[3]);
              })(r)
            ) {
              const u = this.indexOf(t);
              if (-1 !== u) this.detach(u);
              else {
                const d = r[3],
                  h = new Xb(d, d[6], d[3]);
                h.detach(h.indexOf(t));
              }
            }
            const s = this._adjustIndex(e),
              o = this._lContainer;
            !(function kI(n, t, e, r) {
              const i = 10 + r,
                s = e.length;
              r > 0 && (e[i - 1][4] = t),
                r < s - 10
                  ? ((t[4] = e[i]), a_(e, 10 + r, t))
                  : (e.push(t), (t[4] = null)),
                (t[3] = e);
              const o = t[17];
              null !== o &&
                e !== o &&
                (function FI(n, t) {
                  const e = n[9];
                  t[16] !== t[3][3][16] && (n[2] = !0),
                    null === e ? (n[9] = [t]) : e.push(t);
                })(o, t);
              const a = t[19];
              null !== a && a.insertView(n), (t[2] |= 64);
            })(i, r, o, s);
            const a = xd(s, o),
              l = r[K],
              c = rl(l, o[7]);
            return (
              null !== c &&
                (function RI(n, t, e, r, i, s) {
                  (r[0] = i), (r[6] = t), io(n, r, e, 1, i, s);
                })(i, o[6], l, r, c, a),
              t.attachToViewContainerRef(),
              a_(zh(o), s, t),
              t
            );
          }
          move(t, e) {
            return this.insert(t, e);
          }
          indexOf(t) {
            const e = Jb(this._lContainer);
            return null !== e ? e.indexOf(t) : -1;
          }
          remove(t) {
            const e = this._adjustIndex(t, -1),
              r = Td(this._lContainer, e);
            r && (Xa(zh(this._lContainer), e), P_(r[1], r));
          }
          detach(t) {
            const e = this._adjustIndex(t, -1),
              r = Td(this._lContainer, e);
            return r && null != Xa(zh(this._lContainer), e) ? new co(r) : null;
          }
          _adjustIndex(t, e = 0) {
            return t ?? this.length + e;
          }
        };
      function Jb(n) {
        return n[8];
      }
      function zh(n) {
        return n[8] || (n[8] = []);
      }
      function eC(n, t) {
        let e;
        const r = t[n.index];
        if (dn(r)) e = r;
        else {
          let i;
          if (8 & n.type) i = Ve(r);
          else {
            const s = t[K];
            i = s.createComment("");
            const o = Pt(n, t);
            Ur(
              s,
              rl(s, o),
              i,
              (function VI(n, t) {
                return n.nextSibling(t);
              })(s, o),
              !1,
            );
          }
          (t[n.index] = e = rv(r, t, i, n)), vl(t, e);
        }
        return new Xb(e, n, t);
      }
      class Gh {
        constructor(t) {
          (this.queryList = t), (this.matches = null);
        }
        clone() {
          return new Gh(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class Wh {
        constructor(t = []) {
          this.queries = t;
        }
        createEmbeddedView(t) {
          const e = t.queries;
          if (null !== e) {
            const r =
                null !== t.contentQueries ? t.contentQueries[0] : e.length,
              i = [];
            for (let s = 0; s < r; s++) {
              const o = e.getByIndex(s);
              i.push(this.queries[o.indexInDeclarationView].clone());
            }
            return new Wh(i);
          }
          return null;
        }
        insertView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
          for (let e = 0; e < this.queries.length; e++)
            null !== sC(t, e).matches && this.queries[e].setDirty();
        }
      }
      class tC {
        constructor(t, e, r = null) {
          (this.predicate = t), (this.flags = e), (this.read = r);
        }
      }
      class qh {
        constructor(t = []) {
          this.queries = t;
        }
        elementStart(t, e) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(t, e);
        }
        elementEnd(t) {
          for (let e = 0; e < this.queries.length; e++)
            this.queries[e].elementEnd(t);
        }
        embeddedTView(t) {
          let e = null;
          for (let r = 0; r < this.length; r++) {
            const i = null !== e ? e.length : 0,
              s = this.getByIndex(r).embeddedTView(t, i);
            s &&
              ((s.indexInDeclarationView = r),
              null !== e ? e.push(s) : (e = [s]));
          }
          return null !== e ? new qh(e) : null;
        }
        template(t, e) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(t, e);
        }
        getByIndex(t) {
          return this.queries[t];
        }
        get length() {
          return this.queries.length;
        }
        track(t) {
          this.queries.push(t);
        }
      }
      class Kh {
        constructor(t, e = -1) {
          (this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = e);
        }
        elementStart(t, e) {
          this.isApplyingToNode(e) && this.matchTNode(t, e);
        }
        elementEnd(t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1);
        }
        template(t, e) {
          this.elementStart(t, e);
        }
        embeddedTView(t, e) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, e),
              new Kh(this.metadata))
            : null;
        }
        isApplyingToNode(t) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const e = this._declarationNodeIndex;
            let r = t.parent;
            for (; null !== r && 8 & r.type && r.index !== e; ) r = r.parent;
            return e === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(t, e) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const s = r[i];
              this.matchTNodeWithReadOption(t, e, HF(e, s)),
                this.matchTNodeWithReadOption(t, e, Qa(e, t, s, !1, !1));
            }
          else
            r === _n
              ? 4 & e.type && this.matchTNodeWithReadOption(t, e, -1)
              : this.matchTNodeWithReadOption(t, e, Qa(e, t, r, !1, !1));
        }
        matchTNodeWithReadOption(t, e, r) {
          if (null !== r) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === Ie || i === Ut || (i === _n && 4 & e.type))
                this.addMatch(e.index, -2);
              else {
                const s = Qa(e, t, i, !1, !1);
                null !== s && this.addMatch(e.index, s);
              }
            else this.addMatch(e.index, r);
          }
        }
        addMatch(t, e) {
          null === this.matches
            ? (this.matches = [t, e])
            : this.matches.push(t, e);
        }
      }
      function HF(n, t) {
        const e = n.localNames;
        if (null !== e)
          for (let r = 0; r < e.length; r += 2) if (e[r] === t) return e[r + 1];
        return null;
      }
      function zF(n, t, e, r) {
        return -1 === e
          ? (function $F(n, t) {
              return 11 & n.type ? ji(n, t) : 4 & n.type ? kl(n, t) : null;
            })(t, n)
          : -2 === e
            ? (function GF(n, t, e) {
                return e === Ie
                  ? ji(t, n)
                  : e === _n
                    ? kl(t, n)
                    : e === Ut
                      ? eC(t, n)
                      : void 0;
              })(n, t, r)
            : Ws(n, n[1], e, t);
      }
      function nC(n, t, e, r) {
        const i = t[19].queries[r];
        if (null === i.matches) {
          const s = n.data,
            o = e.matches,
            a = [];
          for (let l = 0; l < o.length; l += 2) {
            const c = o[l];
            a.push(c < 0 ? null : zF(t, s[c], o[l + 1], e.metadata.read));
          }
          i.matches = a;
        }
        return i.matches;
      }
      function Yh(n, t, e, r) {
        const i = n.queries.getByIndex(e),
          s = i.matches;
        if (null !== s) {
          const o = nC(n, t, i, e);
          for (let a = 0; a < s.length; a += 2) {
            const l = s[a];
            if (l > 0) r.push(o[a / 2]);
            else {
              const c = s[a + 1],
                u = t[-l];
              for (let d = 10; d < u.length; d++) {
                const h = u[d];
                h[17] === h[3] && Yh(h[1], h, c, r);
              }
              if (null !== u[9]) {
                const d = u[9];
                for (let h = 0; h < d.length; h++) {
                  const f = d[h];
                  Yh(f[1], f, c, r);
                }
              }
            }
          }
        }
        return r;
      }
      function xn(n) {
        const t = D(),
          e = se(),
          r = Bm();
        td(r + 1);
        const i = sC(e, r);
        if (
          n.dirty &&
          (function rT(n) {
            return 4 == (4 & n[2]);
          })(t) ===
            (2 == (2 & i.metadata.flags))
        ) {
          if (null === i.matches) n.reset([]);
          else {
            const s = i.crossesNgTemplate ? Yh(e, t, r, []) : nC(e, t, i, r);
            n.reset(s, kR), n.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function Mo(n, t, e) {
        const r = se();
        r.firstCreatePass &&
          (iC(r, new tC(n, t, e), -1),
          2 == (2 & t) && (r.staticViewQueries = !0)),
          rC(r, D(), t);
      }
      function ss(n, t, e, r) {
        const i = se();
        if (i.firstCreatePass) {
          const s = Ge();
          iC(i, new tC(t, e, r), s.index),
            (function qF(n, t) {
              const e = n.contentQueries || (n.contentQueries = []);
              t !== (e.length ? e[e.length - 1] : -1) &&
                e.push(n.queries.length - 1, t);
            })(i, n),
            2 == (2 & e) && (i.staticContentQueries = !0);
        }
        rC(i, D(), e);
      }
      function On() {
        return (function WF(n, t) {
          return n[19].queries[t].queryList;
        })(D(), Bm());
      }
      function rC(n, t, e) {
        const r = new is(4 == (4 & e));
        Ky(n, t, r, r.destroy),
          null === t[19] && (t[19] = new Wh()),
          t[19].queries.push(new Gh(r));
      }
      function iC(n, t, e) {
        null === n.queries && (n.queries = new qh()),
          n.queries.track(new Kh(t, e));
      }
      function sC(n, t) {
        return n.queries.getByIndex(t);
      }
      function Pl(...n) {}
      const Nl = new w("Application Initializer");
      let Ll = (() => {
        class n {
          constructor(e) {
            (this.appInits = e),
              (this.resolve = Pl),
              (this.reject = Pl),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, i) => {
                (this.resolve = r), (this.reject = i);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const e = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const s = this.appInits[i]();
                if (go(s)) e.push(s);
                else if (Th(s)) {
                  const o = new Promise((a, l) => {
                    s.subscribe({ complete: a, error: l });
                  });
                  e.push(o);
                }
              }
            Promise.all(e)
              .then(() => {
                r();
              })
              .catch((i) => {
                this.reject(i);
              }),
              0 === e.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Nl, 8));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const To = new w("AppId", {
        providedIn: "root",
        factory: function EC() {
          return `${ef()}${ef()}${ef()}`;
        },
      });
      function ef() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const SC = new w("Platform Initializer"),
        Vl = new w("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        MC = new w("appBootstrapListener"),
        Io = new w("AnimationModuleType");
      let pP = (() => {
        class n {
          log(e) {
            console.log(e);
          }
          warn(e) {
            console.warn(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "platform" })),
          n
        );
      })();
      const kn = new w("LocaleId", {
        providedIn: "root",
        factory: () =>
          te(kn, P.Optional | P.SkipSelf) ||
          (function gP() {
            return (typeof $localize < "u" && $localize.locale) || rs;
          })(),
      });
      class _P {
        constructor(t, e) {
          (this.ngModuleFactory = t), (this.componentFactories = e);
        }
      }
      let tf = (() => {
        class n {
          compileModuleSync(e) {
            return new jh(e);
          }
          compileModuleAsync(e) {
            return Promise.resolve(this.compileModuleSync(e));
          }
          compileModuleAndAllComponentsSync(e) {
            const r = this.compileModuleSync(e),
              s = Zn(kt(e).declarations).reduce((o, a) => {
                const l = be(a);
                return l && o.push(new uo(l)), o;
              }, []);
            return new _P(r, s);
          }
          compileModuleAndAllComponentsAsync(e) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(e));
          }
          clearCache() {}
          clearCacheFor(e) {}
          getModuleId(e) {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const bP = (() => Promise.resolve(0))();
      function nf(n) {
        typeof Zone > "u"
          ? bP.then(() => {
              n && n.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", n);
      }
      class le {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: e = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ae(!1)),
            (this.onMicrotaskEmpty = new ae(!1)),
            (this.onStable = new ae(!1)),
            (this.onError = new ae(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const i = this;
          if (
            ((i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.AsyncStackTaggingZoneSpec)
          ) {
            const s = Zone.AsyncStackTaggingZoneSpec;
            i._inner = i._inner.fork(new s("Angular"));
          }
          Zone.TaskTrackingZoneSpec &&
            (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && e),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function CP() {
              let n = Ee.requestAnimationFrame,
                t = Ee.cancelAnimationFrame;
              if (typeof Zone < "u" && n && t) {
                const e = n[Zone.__symbol__("OriginalDelegate")];
                e && (n = e);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: n,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function EP(n) {
              const t = () => {
                !(function wP(n) {
                  n.isCheckStableRunning ||
                    -1 !== n.lastRequestAnimationFrameId ||
                    ((n.lastRequestAnimationFrameId =
                      n.nativeRequestAnimationFrame.call(Ee, () => {
                        n.fakeTopEventTask ||
                          (n.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (n.lastRequestAnimationFrameId = -1),
                                sf(n),
                                (n.isCheckStableRunning = !0),
                                rf(n),
                                (n.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {},
                          )),
                          n.fakeTopEventTask.invoke();
                      })),
                    sf(n));
                })(n);
              };
              n._inner = n._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (e, r, i, s, o, a) => {
                  try {
                    return IC(n), e.invokeTask(i, s, o, a);
                  } finally {
                    ((n.shouldCoalesceEventChangeDetection &&
                      "eventTask" === s.type) ||
                      n.shouldCoalesceRunChangeDetection) &&
                      t(),
                      RC(n);
                  }
                },
                onInvoke: (e, r, i, s, o, a, l) => {
                  try {
                    return IC(n), e.invoke(i, s, o, a, l);
                  } finally {
                    n.shouldCoalesceRunChangeDetection && t(), RC(n);
                  }
                },
                onHasTask: (e, r, i, s) => {
                  e.hasTask(i, s),
                    r === i &&
                      ("microTask" == s.change
                        ? ((n._hasPendingMicrotasks = s.microTask),
                          sf(n),
                          rf(n))
                        : "macroTask" == s.change &&
                          (n.hasPendingMacrotasks = s.macroTask));
                },
                onHandleError: (e, r, i, s) => (
                  e.handleError(i, s),
                  n.runOutsideAngular(() => n.onError.emit(s)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!le.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (le.isInAngularZone()) throw new C(909, !1);
        }
        run(t, e, r) {
          return this._inner.run(t, e, r);
        }
        runTask(t, e, r, i) {
          const s = this._inner,
            o = s.scheduleEventTask("NgZoneEvent: " + i, t, DP, Pl, Pl);
          try {
            return s.runTask(o, e, r);
          } finally {
            s.cancelTask(o);
          }
        }
        runGuarded(t, e, r) {
          return this._inner.runGuarded(t, e, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const DP = {};
      function rf(n) {
        if (0 == n._nesting && !n.hasPendingMicrotasks && !n.isStable)
          try {
            n._nesting++, n.onMicrotaskEmpty.emit(null);
          } finally {
            if ((n._nesting--, !n.hasPendingMicrotasks))
              try {
                n.runOutsideAngular(() => n.onStable.emit(null));
              } finally {
                n.isStable = !0;
              }
          }
      }
      function sf(n) {
        n.hasPendingMicrotasks = !!(
          n._hasPendingMicrotasks ||
          ((n.shouldCoalesceEventChangeDetection ||
            n.shouldCoalesceRunChangeDetection) &&
            -1 !== n.lastRequestAnimationFrameId)
        );
      }
      function IC(n) {
        n._nesting++,
          n.isStable && ((n.isStable = !1), n.onUnstable.emit(null));
      }
      function RC(n) {
        n._nesting--, rf(n);
      }
      class SP {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ae()),
            (this.onMicrotaskEmpty = new ae()),
            (this.onStable = new ae()),
            (this.onError = new ae());
        }
        run(t, e, r) {
          return t.apply(e, r);
        }
        runGuarded(t, e, r) {
          return t.apply(e, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, e, r, i) {
          return t.apply(e, r);
        }
      }
      const xC = new w(""),
        Bl = new w("");
      let cf,
        af = (() => {
          class n {
            constructor(e, r, i) {
              (this._ngZone = e),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                cf ||
                  ((function MP(n) {
                    cf = n;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                e.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      le.assertNotInAngularZone(),
                        nf(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                nf(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let e = this._callbacks.pop();
                    clearTimeout(e.timeoutId), e.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let e = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(e) ||
                    (clearTimeout(r.timeoutId), !1),
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((e) => ({
                    source: e.source,
                    creationLocation: e.creationLocation,
                    data: e.data,
                  }))
                : [];
            }
            addCallback(e, r, i) {
              let s = -1;
              r &&
                r > 0 &&
                (s = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (o) => o.timeoutId !== s,
                  )),
                    e(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: e, timeoutId: s, updateCb: i });
            }
            whenStable(e, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
                );
              this.addCallback(e, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(e) {
              this.registry.registerApplication(e, this);
            }
            unregisterApplication(e) {
              this.registry.unregisterApplication(e);
            }
            findProviders(e, r, i) {
              return [];
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(le), m(lf), m(Bl));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        lf = (() => {
          class n {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(e, r) {
              this._applications.set(e, r);
            }
            unregisterApplication(e) {
              this._applications.delete(e);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(e) {
              return this._applications.get(e) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(e, r = !0) {
              return cf?.findTestabilityInTree(this, e, r) ?? null;
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = A({
              token: n,
              factory: n.ɵfac,
              providedIn: "platform",
            })),
            n
          );
        })(),
        Cr = null;
      const OC = new w("AllowMultipleToken"),
        uf = new w("PlatformDestroyListeners");
      class kC {
        constructor(t, e) {
          (this.name = t), (this.token = e);
        }
      }
      function PC(n, t, e = []) {
        const r = `Platform: ${t}`,
          i = new w(r);
        return (s = []) => {
          let o = df();
          if (!o || o.injector.get(OC, !1)) {
            const a = [...e, ...s, { provide: i, useValue: !0 }];
            n
              ? n(a)
              : (function IP(n) {
                  if (Cr && !Cr.get(OC, !1)) throw new C(400, !1);
                  Cr = n;
                  const t = n.get(LC);
                  (function FC(n) {
                    const t = n.get(SC, null);
                    t && t.forEach((e) => e());
                  })(n);
                })(
                  (function NC(n = [], t) {
                    return Ne.create({
                      name: t,
                      providers: [
                        { provide: zd, useValue: "platform" },
                        { provide: uf, useValue: new Set([() => (Cr = null)]) },
                        ...n,
                      ],
                    });
                  })(a, r),
                );
          }
          return (function xP(n) {
            const t = df();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function df() {
        return Cr?.get(LC) ?? null;
      }
      let LC = (() => {
        class n {
          constructor(e) {
            (this._injector = e),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(e, r) {
            const i = (function BC(n, t) {
                let e;
                return (
                  (e =
                    "noop" === n
                      ? new SP()
                      : ("zone.js" === n ? void 0 : n) || new le(t)),
                  e
                );
              })(
                r?.ngZone,
                (function VC(n) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!n || !n.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!n || !n.ngZoneRunCoalescing) || !1,
                  };
                })(r),
              ),
              s = [{ provide: le, useValue: i }];
            return i.run(() => {
              const o = Ne.create({
                  providers: s,
                  parent: this.injector,
                  name: e.moduleType.name,
                }),
                a = e.create(o),
                l = a.injector.get(Yn, null);
              if (!l) throw new C(402, !1);
              return (
                i.runOutsideAngular(() => {
                  const c = i.onError.subscribe({
                    next: (u) => {
                      l.handleError(u);
                    },
                  });
                  a.onDestroy(() => {
                    jl(this._modules, a), c.unsubscribe();
                  });
                }),
                (function jC(n, t, e) {
                  try {
                    const r = e();
                    return go(r)
                      ? r.catch((i) => {
                          throw (
                            (t.runOutsideAngular(() => n.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => n.handleError(r)), r);
                  }
                })(l, i, () => {
                  const c = a.injector.get(Ll);
                  return (
                    c.runInitializers(),
                    c.donePromise.then(
                      () => (
                        (function fb(n) {
                          xt(n, "Expected localeId to be defined"),
                            "string" == typeof n &&
                              (hb = n.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(kn, rs) || rs),
                        this._moduleDoBootstrap(a),
                        a
                      ),
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(e, r = []) {
            const i = UC({}, r);
            return (function AP(n, t, e) {
              const r = new jh(e);
              return Promise.resolve(r);
            })(0, 0, e).then((s) => this.bootstrapModuleFactory(s, i));
          }
          _moduleDoBootstrap(e) {
            const r = e.injector.get(ls);
            if (e._bootstrapComponents.length > 0)
              e._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!e.instance.ngDoBootstrap) throw new C(403, !1);
              e.instance.ngDoBootstrap(r);
            }
            this._modules.push(e);
          }
          onDestroy(e) {
            this._destroyListeners.push(e);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const e = this._injector.get(uf, null);
            e && (e.forEach((r) => r()), e.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Ne));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "platform" })),
          n
        );
      })();
      function UC(n, t) {
        return Array.isArray(t) ? t.reduce(UC, n) : { ...n, ...t };
      }
      let ls = (() => {
        class n {
          constructor(e, r, i) {
            (this._zone = e),
              (this._injector = r),
              (this._exceptionHandler = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const s = new ye((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              o = new ye((a) => {
                let l;
                this._zone.runOutsideAngular(() => {
                  l = this._zone.onStable.subscribe(() => {
                    le.assertNotInAngularZone(),
                      nf(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const c = this._zone.onUnstable.subscribe(() => {
                  le.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  l.unsubscribe(), c.unsubscribe();
                };
              });
            this.isStable = Ns(s, o.pipe(ym()));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(e, r) {
            const i = e instanceof py;
            if (!this._injector.get(Ll).done)
              throw (
                (!i &&
                  (function Ci(n) {
                    const t = be(n) || ft(n) || pt(n);
                    return null !== t && t.standalone;
                  })(e),
                new C(405, false))
              );
            let o;
            (o = i ? e : this._injector.get(Gr).resolveComponentFactory(e)),
              this.componentTypes.push(o.componentType);
            const a = (function TP(n) {
                return n.isBoundToModule;
              })(o)
                ? void 0
                : this._injector.get(Yr),
              c = o.create(Ne.NULL, [], r || o.selector, a),
              u = c.location.nativeElement,
              d = c.injector.get(xC, null);
            return (
              d?.registerApplication(u),
              c.onDestroy(() => {
                this.detachView(c.hostView),
                  jl(this.components, c),
                  d?.unregisterApplication(u);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let e of this._views) e.detectChanges();
            } catch (e) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(e),
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(e) {
            const r = e;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(e) {
            const r = e;
            jl(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(e) {
            this.attachView(e.hostView),
              this.tick(),
              this.components.push(e),
              this._injector
                .get(MC, [])
                .concat(this._bootstrapListeners)
                .forEach((i) => i(e));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((e) => e()),
                  this._views.slice().forEach((e) => e.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(e) {
            return (
              this._destroyListeners.push(e),
              () => jl(this._destroyListeners, e)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const e = this._injector;
            e.destroy && !e.destroyed && e.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(le), m(mr), m(Yn));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function jl(n, t) {
        const e = n.indexOf(t);
        e > -1 && n.splice(e, 1);
      }
      let $C = !0,
        zC = !1,
        cs = (() => {
          class n {}
          return (n.__NG_ELEMENT_ID__ = PP), n;
        })();
      function PP(n) {
        return (function NP(n, t, e) {
          if (Ba(n) && !e) {
            const r = Nt(n.index, t);
            return new co(r, r);
          }
          return 47 & n.type ? new co(t[16], t) : null;
        })(Ge(), D(), 16 == (16 & n));
      }
      class KC {
        constructor() {}
        supports(t) {
          return ho(t);
        }
        create(t) {
          return new HP(t);
        }
      }
      const UP = (n, t) => t;
      class HP {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || UP);
        }
        forEachItem(t) {
          let e;
          for (e = this._itHead; null !== e; e = e._next) t(e);
        }
        forEachOperation(t) {
          let e = this._itHead,
            r = this._removalsHead,
            i = 0,
            s = null;
          for (; e || r; ) {
            const o = !r || (e && e.currentIndex < ZC(r, i, s)) ? e : r,
              a = ZC(o, i, s),
              l = o.currentIndex;
            if (o === r) i--, (r = r._nextRemoved);
            else if (((e = e._next), null == o.previousIndex)) i++;
            else {
              s || (s = []);
              const c = a - i,
                u = l - i;
              if (c != u) {
                for (let h = 0; h < c; h++) {
                  const f = h < s.length ? s[h] : (s[h] = 0),
                    p = f + h;
                  u <= p && p < c && (s[h] = f + 1);
                }
                s[o.previousIndex] = u - c;
              }
            }
            a !== l && t(o, a, l);
          }
        }
        forEachPreviousItem(t) {
          let e;
          for (e = this._previousItHead; null !== e; e = e._nextPrevious) t(e);
        }
        forEachAddedItem(t) {
          let e;
          for (e = this._additionsHead; null !== e; e = e._nextAdded) t(e);
        }
        forEachMovedItem(t) {
          let e;
          for (e = this._movesHead; null !== e; e = e._nextMoved) t(e);
        }
        forEachRemovedItem(t) {
          let e;
          for (e = this._removalsHead; null !== e; e = e._nextRemoved) t(e);
        }
        forEachIdentityChange(t) {
          let e;
          for (
            e = this._identityChangesHead;
            null !== e;
            e = e._nextIdentityChange
          )
            t(e);
        }
        diff(t) {
          if ((null == t && (t = []), !ho(t))) throw new C(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let i,
            s,
            o,
            e = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (s = t[a]),
                (o = this._trackByFn(a, s)),
                null !== e && Object.is(e.trackById, o)
                  ? (r && (e = this._verifyReinsertion(e, s, o, a)),
                    Object.is(e.item, s) || this._addIdentityChange(e, s))
                  : ((e = this._mismatch(e, s, o, a)), (r = !0)),
                (e = e._next);
          } else
            (i = 0),
              (function _O(n, t) {
                if (Array.isArray(n))
                  for (let e = 0; e < n.length; e++) t(n[e]);
                else {
                  const e = n[Wr()]();
                  let r;
                  for (; !(r = e.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (o = this._trackByFn(i, a)),
                  null !== e && Object.is(e.trackById, o)
                    ? (r && (e = this._verifyReinsertion(e, a, o, i)),
                      Object.is(e.item, a) || this._addIdentityChange(e, a))
                    : ((e = this._mismatch(e, a, o, i)), (r = !0)),
                  (e = e._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(e), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, e, r, i) {
          let s;
          return (
            null === t ? (s = this._itTail) : ((s = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, e) || this._addIdentityChange(t, e),
                this._reinsertAfter(t, s, i))
              : null !==
                  (t =
                    null === this._linkedRecords
                      ? null
                      : this._linkedRecords.get(r, i))
                ? (Object.is(t.item, e) || this._addIdentityChange(t, e),
                  this._moveAfter(t, s, i))
                : (t = this._addAfter(new $P(e, r), s, i)),
            t
          );
        }
        _verifyReinsertion(t, e, r, i) {
          let s =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== s
              ? (t = this._reinsertAfter(s, t._prev, i))
              : t.currentIndex != i &&
                ((t.currentIndex = i), this._addToMoves(t, i)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const e = t._next;
            this._addToRemovals(this._unlink(t)), (t = e);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, e, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const i = t._prevRemoved,
            s = t._nextRemoved;
          return (
            null === i ? (this._removalsHead = s) : (i._nextRemoved = s),
            null === s ? (this._removalsTail = i) : (s._prevRemoved = i),
            this._insertAfter(t, e, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, e, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, e, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, e, r) {
          return (
            this._insertAfter(t, e, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, e, r) {
          const i = null === e ? this._itHead : e._next;
          return (
            (t._next = i),
            (t._prev = e),
            null === i ? (this._itTail = t) : (i._prev = t),
            null === e ? (this._itHead = t) : (e._next = t),
            null === this._linkedRecords && (this._linkedRecords = new YC()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const e = t._prev,
            r = t._next;
          return (
            null === e ? (this._itHead = r) : (e._next = r),
            null === r ? (this._itTail = e) : (r._prev = e),
            t
          );
        }
        _addToMoves(t, e) {
          return (
            t.previousIndex === e ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new YC()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, e) {
          return (
            (t.item = e),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class $P {
        constructor(t, e) {
          (this.item = t),
            (this.trackById = e),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class zP {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, e) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === e || e <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const e = t._prevDup,
            r = t._nextDup;
          return (
            null === e ? (this._head = r) : (e._nextDup = r),
            null === r ? (this._tail = e) : (r._prevDup = e),
            null === this._head
          );
        }
      }
      class YC {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const e = t.trackById;
          let r = this.map.get(e);
          r || ((r = new zP()), this.map.set(e, r)), r.add(t);
        }
        get(t, e) {
          const i = this.map.get(t);
          return i ? i.get(t, e) : null;
        }
        remove(t) {
          const e = t.trackById;
          return this.map.get(e).remove(t) && this.map.delete(e), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function ZC(n, t, e) {
        const r = n.previousIndex;
        if (null === r) return r;
        let i = 0;
        return e && r < e.length && (i = e[r]), r + t + i;
      }
      class QC {
        constructor() {}
        supports(t) {
          return t instanceof Map || Eh(t);
        }
        create() {
          return new GP();
        }
      }
      class GP {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(t) {
          let e;
          for (e = this._mapHead; null !== e; e = e._next) t(e);
        }
        forEachPreviousItem(t) {
          let e;
          for (e = this._previousMapHead; null !== e; e = e._nextPrevious) t(e);
        }
        forEachChangedItem(t) {
          let e;
          for (e = this._changesHead; null !== e; e = e._nextChanged) t(e);
        }
        forEachAddedItem(t) {
          let e;
          for (e = this._additionsHead; null !== e; e = e._nextAdded) t(e);
        }
        forEachRemovedItem(t) {
          let e;
          for (e = this._removalsHead; null !== e; e = e._nextRemoved) t(e);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || Eh(t))) throw new C(900, !1);
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let e = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (r, i) => {
              if (e && e.key === i)
                this._maybeAddToChanges(e, r),
                  (this._appendAfter = e),
                  (e = e._next);
              else {
                const s = this._getOrCreateRecordForKey(i, r);
                e = this._insertBeforeOrAppend(e, s);
              }
            }),
            e)
          ) {
            e._prev && (e._prev._next = null), (this._removalsHead = e);
            for (let r = e; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(t, e) {
          if (t) {
            const r = t._prev;
            return (
              (e._next = t),
              (e._prev = r),
              (t._prev = e),
              r && (r._next = e),
              t === this._mapHead && (this._mapHead = e),
              (this._appendAfter = t),
              t
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = e), (e._prev = this._appendAfter))
              : (this._mapHead = e),
            (this._appendAfter = e),
            null
          );
        }
        _getOrCreateRecordForKey(t, e) {
          if (this._records.has(t)) {
            const i = this._records.get(t);
            this._maybeAddToChanges(i, e);
            const s = i._prev,
              o = i._next;
            return (
              s && (s._next = o),
              o && (o._prev = s),
              (i._next = null),
              (i._prev = null),
              i
            );
          }
          const r = new WP(t);
          return (
            this._records.set(t, r),
            (r.currentValue = e),
            this._addToAdditions(r),
            r
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              this._previousMapHead = this._mapHead, t = this._previousMapHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged)
              t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded)
              t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, e) {
          Object.is(e, t.currentValue) ||
            ((t.previousValue = t.currentValue),
            (t.currentValue = e),
            this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, e) {
          t instanceof Map
            ? t.forEach(e)
            : Object.keys(t).forEach((r) => e(t[r], r));
        }
      }
      class WP {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function XC() {
        return new $l([new KC()]);
      }
      let $l = (() => {
        class n {
          constructor(e) {
            this.factories = e;
          }
          static create(e, r) {
            if (null != r) {
              const i = r.factories.slice();
              e = e.concat(i);
            }
            return new n(e);
          }
          static extend(e) {
            return {
              provide: n,
              useFactory: (r) => n.create(e, r || XC()),
              deps: [[n, new jr(), new Wn()]],
            };
          }
          find(e) {
            const r = this.factories.find((i) => i.supports(e));
            if (null != r) return r;
            throw new C(901, !1);
          }
        }
        return (n.ɵprov = A({ token: n, providedIn: "root", factory: XC })), n;
      })();
      function JC() {
        return new Ro([new QC()]);
      }
      let Ro = (() => {
        class n {
          constructor(e) {
            this.factories = e;
          }
          static create(e, r) {
            if (r) {
              const i = r.factories.slice();
              e = e.concat(i);
            }
            return new n(e);
          }
          static extend(e) {
            return {
              provide: n,
              useFactory: (r) => n.create(e, r || JC()),
              deps: [[n, new jr(), new Wn()]],
            };
          }
          find(e) {
            const r = this.factories.find((i) => i.supports(e));
            if (r) return r;
            throw new C(901, !1);
          }
        }
        return (n.ɵprov = A({ token: n, providedIn: "root", factory: JC })), n;
      })();
      const YP = PC(null, "core", []);
      let ZP = (() => {
        class n {
          constructor(e) {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(ls));
          }),
          (n.ɵmod = ve({ type: n })),
          (n.ɵinj = _e({})),
          n
        );
      })();
      function tr(n) {
        return "boolean" == typeof n ? n : null != n && "false" !== n;
      }
      let zl = null;
      function Fn() {
        return zl;
      }
      const Y = new w("DocumentToken");
      let mf = (() => {
        class n {
          historyGo(e) {
            throw new Error("Not implemented");
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({
            token: n,
            factory: function () {
              return (function eN() {
                return m(eD);
              })();
            },
            providedIn: "platform",
          })),
          n
        );
      })();
      const tN = new w("Location Initialized");
      let eD = (() => {
        class n extends mf {
          constructor(e) {
            super(), (this._doc = e), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Fn().getBaseHref(this._doc);
          }
          onPopState(e) {
            const r = Fn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", e, !1),
              () => r.removeEventListener("popstate", e)
            );
          }
          onHashChange(e) {
            const r = Fn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", e, !1),
              () => r.removeEventListener("hashchange", e)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(e) {
            this.location.pathname = e;
          }
          pushState(e, r, i) {
            tD() ? this._history.pushState(e, r, i) : (this.location.hash = i);
          }
          replaceState(e, r, i) {
            tD()
              ? this._history.replaceState(e, r, i)
              : (this.location.hash = i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(e = 0) {
            this._history.go(e);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Y));
          }),
          (n.ɵprov = A({
            token: n,
            factory: function () {
              return (function nN() {
                return new eD(m(Y));
              })();
            },
            providedIn: "platform",
          })),
          n
        );
      })();
      function tD() {
        return !!window.history.pushState;
      }
      function _f(n, t) {
        if (0 == n.length) return t;
        if (0 == t.length) return n;
        let e = 0;
        return (
          n.endsWith("/") && e++,
          t.startsWith("/") && e++,
          2 == e ? n + t.substring(1) : 1 == e ? n + t : n + "/" + t
        );
      }
      function nD(n) {
        const t = n.match(/#|\?|$/),
          e = (t && t.index) || n.length;
        return n.slice(0, e - ("/" === n[e - 1] ? 1 : 0)) + n.slice(e);
      }
      function nr(n) {
        return n && "?" !== n[0] ? "?" + n : n;
      }
      let Qr = (() => {
        class n {
          historyGo(e) {
            throw new Error("Not implemented");
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({
            token: n,
            factory: function () {
              return te(iD);
            },
            providedIn: "root",
          })),
          n
        );
      })();
      const rD = new w("appBaseHref");
      let iD = (() => {
          class n extends Qr {
            constructor(e, r) {
              super(),
                (this._platformLocation = e),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  te(Y).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(e) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(e),
                this._platformLocation.onHashChange(e),
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(e) {
              return _f(this._baseHref, e);
            }
            path(e = !1) {
              const r =
                  this._platformLocation.pathname +
                  nr(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && e ? `${r}${i}` : r;
            }
            pushState(e, r, i, s) {
              const o = this.prepareExternalUrl(i + nr(s));
              this._platformLocation.pushState(e, r, o);
            }
            replaceState(e, r, i, s) {
              const o = this.prepareExternalUrl(i + nr(s));
              this._platformLocation.replaceState(e, r, o);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(e = 0) {
              this._platformLocation.historyGo?.(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(mf), m(rD, 8));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        rN = (() => {
          class n extends Qr {
            constructor(e, r) {
              super(),
                (this._platformLocation = e),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(e) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(e),
                this._platformLocation.onHashChange(e),
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(e = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(e) {
              const r = _f(this._baseHref, e);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(e, r, i, s) {
              let o = this.prepareExternalUrl(i + nr(s));
              0 == o.length && (o = this._platformLocation.pathname),
                this._platformLocation.pushState(e, r, o);
            }
            replaceState(e, r, i, s) {
              let o = this.prepareExternalUrl(i + nr(s));
              0 == o.length && (o = this._platformLocation.pathname),
                this._platformLocation.replaceState(e, r, o);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(e = 0) {
              this._platformLocation.historyGo?.(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(mf), m(rD, 8));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        xo = (() => {
          class n {
            constructor(e) {
              (this._subject = new ae()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = e);
              const r = this._locationStrategy.getBaseHref();
              (this._baseHref = nD(sD(r))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(e = !1) {
              return this.normalize(this._locationStrategy.path(e));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(e, r = "") {
              return this.path() == this.normalize(e + nr(r));
            }
            normalize(e) {
              return n.stripTrailingSlash(
                (function sN(n, t) {
                  return n && t.startsWith(n) ? t.substring(n.length) : t;
                })(this._baseHref, sD(e)),
              );
            }
            prepareExternalUrl(e) {
              return (
                e && "/" !== e[0] && (e = "/" + e),
                this._locationStrategy.prepareExternalUrl(e)
              );
            }
            go(e, r = "", i = null) {
              this._locationStrategy.pushState(i, "", e, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(e + nr(r)),
                  i,
                );
            }
            replaceState(e, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", e, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(e + nr(r)),
                  i,
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(e = 0) {
              this._locationStrategy.historyGo?.(e);
            }
            onUrlChange(e) {
              return (
                this._urlChangeListeners.push(e),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(e);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(e = "", r) {
              this._urlChangeListeners.forEach((i) => i(e, r));
            }
            subscribe(e, r, i) {
              return this._subject.subscribe({
                next: e,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (n.normalizeQueryParams = nr),
            (n.joinWithSlash = _f),
            (n.stripTrailingSlash = nD),
            (n.ɵfac = function (e) {
              return new (e || n)(m(Qr));
            }),
            (n.ɵprov = A({
              token: n,
              factory: function () {
                return (function iN() {
                  return new xo(m(Qr));
                })();
              },
              providedIn: "root",
            })),
            n
          );
        })();
      function sD(n) {
        return n.replace(/\/index.html$/, "");
      }
      function pD(n, t) {
        t = encodeURIComponent(t);
        for (const e of n.split(";")) {
          const r = e.indexOf("="),
            [i, s] = -1 == r ? [e, ""] : [e.slice(0, r), e.slice(r + 1)];
          if (i.trim() === t) return decodeURIComponent(s);
        }
        return null;
      }
      let gD = (() => {
        class n {
          constructor(e, r, i, s) {
            (this._iterableDiffers = e),
              (this._keyValueDiffers = r),
              (this._ngEl = i),
              (this._renderer = s),
              (this._iterableDiffer = null),
              (this._keyValueDiffer = null),
              (this._initialClasses = []),
              (this._rawClass = null);
          }
          set klass(e) {
            this._removeClasses(this._initialClasses),
              (this._initialClasses =
                "string" == typeof e ? e.split(/\s+/) : []),
              this._applyClasses(this._initialClasses),
              this._applyClasses(this._rawClass);
          }
          set ngClass(e) {
            this._removeClasses(this._rawClass),
              this._applyClasses(this._initialClasses),
              (this._iterableDiffer = null),
              (this._keyValueDiffer = null),
              (this._rawClass = "string" == typeof e ? e.split(/\s+/) : e),
              this._rawClass &&
                (ho(this._rawClass)
                  ? (this._iterableDiffer = this._iterableDiffers
                      .find(this._rawClass)
                      .create())
                  : (this._keyValueDiffer = this._keyValueDiffers
                      .find(this._rawClass)
                      .create()));
          }
          ngDoCheck() {
            if (this._iterableDiffer) {
              const e = this._iterableDiffer.diff(this._rawClass);
              e && this._applyIterableChanges(e);
            } else if (this._keyValueDiffer) {
              const e = this._keyValueDiffer.diff(this._rawClass);
              e && this._applyKeyValueChanges(e);
            }
          }
          _applyKeyValueChanges(e) {
            e.forEachAddedItem((r) => this._toggleClass(r.key, r.currentValue)),
              e.forEachChangedItem((r) =>
                this._toggleClass(r.key, r.currentValue),
              ),
              e.forEachRemovedItem((r) => {
                r.previousValue && this._toggleClass(r.key, !1);
              });
          }
          _applyIterableChanges(e) {
            e.forEachAddedItem((r) => {
              if ("string" != typeof r.item)
                throw new Error(
                  `NgClass can only toggle CSS classes expressed as strings, got ${De(r.item)}`,
                );
              this._toggleClass(r.item, !0);
            }),
              e.forEachRemovedItem((r) => this._toggleClass(r.item, !1));
          }
          _applyClasses(e) {
            e &&
              (Array.isArray(e) || e instanceof Set
                ? e.forEach((r) => this._toggleClass(r, !0))
                : Object.keys(e).forEach((r) => this._toggleClass(r, !!e[r])));
          }
          _removeClasses(e) {
            e &&
              (Array.isArray(e) || e instanceof Set
                ? e.forEach((r) => this._toggleClass(r, !1))
                : Object.keys(e).forEach((r) => this._toggleClass(r, !1)));
          }
          _toggleClass(e, r) {
            (e = e.trim()) &&
              e.split(/\s+/g).forEach((i) => {
                r
                  ? this._renderer.addClass(this._ngEl.nativeElement, i)
                  : this._renderer.removeClass(this._ngEl.nativeElement, i);
              });
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_($l), _(Ro), _(Ie), _(Kn));
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [["", "ngClass", ""]],
            inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
            standalone: !0,
          })),
          n
        );
      })();
      class $N {
        constructor(t, e, r, i) {
          (this.$implicit = t),
            (this.ngForOf = e),
            (this.index = r),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let Fo = (() => {
        class n {
          constructor(e, r, i) {
            (this._viewContainer = e),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(e) {
            (this._ngForOf = e), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(e) {
            this._trackByFn = e;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(e) {
            e && (this._template = e);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const e = this._ngForOf;
              !this._differ &&
                e &&
                (this._differ = this._differs
                  .find(e)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const e = this._differ.diff(this._ngForOf);
              e && this._applyChanges(e);
            }
          }
          _applyChanges(e) {
            const r = this._viewContainer;
            e.forEachOperation((i, s, o) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new $N(i.item, this._ngForOf, -1, -1),
                  null === o ? void 0 : o,
                );
              else if (null == o) r.remove(null === s ? void 0 : s);
              else if (null !== s) {
                const a = r.get(s);
                r.move(a, o), yD(a, i);
              }
            });
            for (let i = 0, s = r.length; i < s; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = s), (a.ngForOf = this._ngForOf);
            }
            e.forEachIdentityChange((i) => {
              yD(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(e, r) {
            return !0;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(Ut), _(_n), _($l));
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          n
        );
      })();
      function yD(n, t) {
        n.context.$implicit = t.item;
      }
      let Af = (() => {
        class n {
          constructor(e, r) {
            (this._viewContainer = e),
              (this._context = new GN()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(e) {
            (this._context.$implicit = this._context.ngIf = e),
              this._updateView();
          }
          set ngIfThen(e) {
            vD("ngIfThen", e),
              (this._thenTemplateRef = e),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(e) {
            vD("ngIfElse", e),
              (this._elseTemplateRef = e),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context,
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context,
                  )));
          }
          static ngTemplateContextGuard(e, r) {
            return !0;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(Ut), _(_n));
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          n
        );
      })();
      class GN {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function vD(n, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${n} must be a TemplateRef, but received '${De(t)}'.`,
          );
      }
      let CD = (() => {
          class n {
            constructor(e, r, i) {
              (this._ngEl = e),
                (this._differs = r),
                (this._renderer = i),
                (this._ngStyle = null),
                (this._differ = null);
            }
            set ngStyle(e) {
              (this._ngStyle = e),
                !this._differ &&
                  e &&
                  (this._differ = this._differs.find(e).create());
            }
            ngDoCheck() {
              if (this._differ) {
                const e = this._differ.diff(this._ngStyle);
                e && this._applyChanges(e);
              }
            }
            _setStyle(e, r) {
              const [i, s] = e.split("."),
                o = -1 === i.indexOf("-") ? void 0 : Mt.DashCase;
              null != r
                ? this._renderer.setStyle(
                    this._ngEl.nativeElement,
                    i,
                    s ? `${r}${s}` : r,
                    o,
                  )
                : this._renderer.removeStyle(this._ngEl.nativeElement, i, o);
            }
            _applyChanges(e) {
              e.forEachRemovedItem((r) => this._setStyle(r.key, null)),
                e.forEachAddedItem((r) =>
                  this._setStyle(r.key, r.currentValue),
                ),
                e.forEachChangedItem((r) =>
                  this._setStyle(r.key, r.currentValue),
                );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Ie), _(Ro), _(Kn));
            }),
            (n.ɵdir = F({
              type: n,
              selectors: [["", "ngStyle", ""]],
              inputs: { ngStyle: "ngStyle" },
              standalone: !0,
            })),
            n
          );
        })(),
        Rf = (() => {
          class n {
            transform(e) {
              return JSON.stringify(e, null, 2);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵpipe = Dt({ name: "json", type: n, pure: !1, standalone: !0 })),
            n
          );
        })(),
        wD = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })();
      const ED = "browser";
      let C1 = (() => {
        class n {}
        return (
          (n.ɵprov = A({
            token: n,
            providedIn: "root",
            factory: () => new D1(m(Y), window),
          })),
          n
        );
      })();
      class D1 {
        constructor(t, e) {
          (this.document = t), (this.window = e), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const e = (function w1(n, t) {
            const e = n.getElementById(t) || n.getElementsByName(t)[0];
            if (e) return e;
            if (
              "function" == typeof n.createTreeWalker &&
              n.body &&
              (n.body.createShadowRoot || n.body.attachShadow)
            ) {
              const r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const s = i.shadowRoot;
                if (s) {
                  const o =
                    s.getElementById(t) || s.querySelector(`[name="${t}"]`);
                  if (o) return o;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          e && (this.scrollToElement(e), e.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const e = this.window.history;
            e && e.scrollRestoration && (e.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const e = t.getBoundingClientRect(),
            r = e.left + this.window.pageXOffset,
            i = e.top + this.window.pageYOffset,
            s = this.offset();
          this.window.scrollTo(r - s[0], i - s[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              SD(this.window.history) ||
              SD(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function SD(n) {
        return Object.getOwnPropertyDescriptor(n, "scrollRestoration");
      }
      class MD {}
      class Pf extends class U1 extends class JP {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function XP(n) {
            zl || (zl = n);
          })(new Pf());
        }
        onAndCancel(t, e, r) {
          return (
            t.addEventListener(e, r, !1),
            () => {
              t.removeEventListener(e, r, !1);
            }
          );
        }
        dispatchEvent(t, e) {
          t.dispatchEvent(e);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, e) {
          return (e = e || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, e) {
          return "window" === e
            ? window
            : "document" === e
              ? t
              : "body" === e
                ? t.body
                : null;
        }
        getBaseHref(t) {
          const e = (function H1() {
            return (
              (No = No || document.querySelector("base")),
              No ? No.getAttribute("href") : null
            );
          })();
          return null == e
            ? null
            : (function $1(n) {
                (tc = tc || document.createElement("a")),
                  tc.setAttribute("href", n);
                const t = tc.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(e);
        }
        resetBaseElement() {
          No = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return pD(document.cookie, t);
        }
      }
      let tc,
        No = null;
      const RD = new w("TRANSITION_ID"),
        G1 = [
          {
            provide: Nl,
            useFactory: function z1(n, t, e) {
              return () => {
                e.get(Ll).donePromise.then(() => {
                  const r = Fn(),
                    i = t.querySelectorAll(`style[ng-transition="${n}"]`);
                  for (let s = 0; s < i.length; s++) r.remove(i[s]);
                });
              };
            },
            deps: [RD, Y, Ne],
            multi: !0,
          },
        ];
      let q1 = (() => {
        class n {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const nc = new w("EventManagerPlugins");
      let rc = (() => {
        class n {
          constructor(e, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              e.forEach((i) => (i.manager = this)),
              (this._plugins = e.slice().reverse());
          }
          addEventListener(e, r, i) {
            return this._findPluginFor(r).addEventListener(e, r, i);
          }
          addGlobalEventListener(e, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(e, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(e) {
            const r = this._eventNameToPlugin.get(e);
            if (r) return r;
            const i = this._plugins;
            for (let s = 0; s < i.length; s++) {
              const o = i[s];
              if (o.supports(e)) return this._eventNameToPlugin.set(e, o), o;
            }
            throw new Error(`No event manager plugin found for event ${e}`);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(nc), m(le));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class xD {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, e, r) {
          const i = Fn().getGlobalEventTarget(this._doc, t);
          if (!i)
            throw new Error(`Unsupported event target ${i} for event ${e}`);
          return this.addEventListener(i, e, r);
        }
      }
      let OD = (() => {
          class n {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(e) {
              const r = new Set();
              e.forEach((i) => {
                this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(e) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        Lo = (() => {
          class n extends OD {
            constructor(e) {
              super(),
                (this._doc = e),
                (this._hostNodes = new Map()),
                this._hostNodes.set(e.head, []);
            }
            _addStylesToHost(e, r, i) {
              e.forEach((s) => {
                const o = this._doc.createElement("style");
                (o.textContent = s), i.push(r.appendChild(o));
              });
            }
            addHost(e) {
              const r = [];
              this._addStylesToHost(this._stylesSet, e, r),
                this._hostNodes.set(e, r);
            }
            removeHost(e) {
              const r = this._hostNodes.get(e);
              r && r.forEach(kD), this._hostNodes.delete(e);
            }
            onStylesAdded(e) {
              this._hostNodes.forEach((r, i) => {
                this._addStylesToHost(e, i, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((e) => e.forEach(kD));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })();
      function kD(n) {
        Fn().remove(n);
      }
      const Nf = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Lf = /%COMP%/g;
      function ic(n, t, e) {
        for (let r = 0; r < t.length; r++) {
          let i = t[r];
          Array.isArray(i) ? ic(n, i, e) : ((i = i.replace(Lf, n)), e.push(i));
        }
        return e;
      }
      function ND(n) {
        return (t) => {
          if ("__ngUnwrap__" === t) return n;
          !1 === n(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let sc = (() => {
        class n {
          constructor(e, r, i) {
            (this.eventManager = e),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Vf(e));
          }
          createRenderer(e, r) {
            if (!e || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case cn.Emulated: {
                let i = this.rendererByCompId.get(r.id);
                return (
                  i ||
                    ((i = new J1(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId,
                    )),
                    this.rendererByCompId.set(r.id, i)),
                  i.applyToHost(e),
                  i
                );
              }
              case 1:
              case cn.ShadowDom:
                return new eL(this.eventManager, this.sharedStylesHost, e, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const i = ic(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(i),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(rc), m(Lo), m(To));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class Vf {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, e) {
          return e
            ? document.createElementNS(Nf[e] || e, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, e) {
          (VD(t) ? t.content : t).appendChild(e);
        }
        insertBefore(t, e, r) {
          t && (VD(t) ? t.content : t).insertBefore(e, r);
        }
        removeChild(t, e) {
          t && t.removeChild(e);
        }
        selectRootElement(t, e) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return e || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, e, r, i) {
          if (i) {
            e = i + ":" + e;
            const s = Nf[i];
            s ? t.setAttributeNS(s, e, r) : t.setAttribute(e, r);
          } else t.setAttribute(e, r);
        }
        removeAttribute(t, e, r) {
          if (r) {
            const i = Nf[r];
            i ? t.removeAttributeNS(i, e) : t.removeAttribute(`${r}:${e}`);
          } else t.removeAttribute(e);
        }
        addClass(t, e) {
          t.classList.add(e);
        }
        removeClass(t, e) {
          t.classList.remove(e);
        }
        setStyle(t, e, r, i) {
          i & (Mt.DashCase | Mt.Important)
            ? t.style.setProperty(e, r, i & Mt.Important ? "important" : "")
            : (t.style[e] = r);
        }
        removeStyle(t, e, r) {
          r & Mt.DashCase ? t.style.removeProperty(e) : (t.style[e] = "");
        }
        setProperty(t, e, r) {
          t[e] = r;
        }
        setValue(t, e) {
          t.nodeValue = e;
        }
        listen(t, e, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, e, ND(r))
            : this.eventManager.addEventListener(t, e, ND(r));
        }
      }
      function VD(n) {
        return "TEMPLATE" === n.tagName && void 0 !== n.content;
      }
      class J1 extends Vf {
        constructor(t, e, r, i) {
          super(t), (this.component = r);
          const s = ic(i + "-" + r.id, r.styles, []);
          e.addStyles(s),
            (this.contentAttr = (function Z1(n) {
              return "_ngcontent-%COMP%".replace(Lf, n);
            })(i + "-" + r.id)),
            (this.hostAttr = (function Q1(n) {
              return "_nghost-%COMP%".replace(Lf, n);
            })(i + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, e) {
          const r = super.createElement(t, e);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class eL extends Vf {
        constructor(t, e, r, i) {
          super(t),
            (this.sharedStylesHost = e),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const s = ic(i.id, i.styles, []);
          for (let o = 0; o < s.length; o++) {
            const a = document.createElement("style");
            (a.textContent = s[o]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, e) {
          return super.appendChild(this.nodeOrShadowRoot(t), e);
        }
        insertBefore(t, e, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), e, r);
        }
        removeChild(t, e) {
          return super.removeChild(this.nodeOrShadowRoot(t), e);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t)),
          );
        }
      }
      let tL = (() => {
        class n extends xD {
          constructor(e) {
            super(e);
          }
          supports(e) {
            return !0;
          }
          addEventListener(e, r, i) {
            return (
              e.addEventListener(r, i, !1),
              () => this.removeEventListener(e, r, i)
            );
          }
          removeEventListener(e, r, i) {
            return e.removeEventListener(r, i);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Y));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const BD = ["alt", "control", "meta", "shift"],
        nL = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        rL = {
          alt: (n) => n.altKey,
          control: (n) => n.ctrlKey,
          meta: (n) => n.metaKey,
          shift: (n) => n.shiftKey,
        };
      let iL = (() => {
        class n extends xD {
          constructor(e) {
            super(e);
          }
          supports(e) {
            return null != n.parseEventName(e);
          }
          addEventListener(e, r, i) {
            const s = n.parseEventName(r),
              o = n.eventCallback(s.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Fn().onAndCancel(e, s.domEventName, o));
          }
          static parseEventName(e) {
            const r = e.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const s = n._normalizeKey(r.pop());
            let o = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (o = "code.")),
              BD.forEach((c) => {
                const u = r.indexOf(c);
                u > -1 && (r.splice(u, 1), (o += c + "."));
              }),
              (o += s),
              0 != r.length || 0 === s.length)
            )
              return null;
            const l = {};
            return (l.domEventName = i), (l.fullKey = o), l;
          }
          static matchEventFullKeyCode(e, r) {
            let i = nL[e.key] || e.key,
              s = "";
            return (
              r.indexOf("code.") > -1 && ((i = e.code), (s = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                BD.forEach((o) => {
                  o !== i && (0, rL[o])(e) && (s += o + ".");
                }),
                (s += i),
                s === r)
            );
          }
          static eventCallback(e, r, i) {
            return (s) => {
              n.matchEventFullKeyCode(s, e) && i.runGuarded(() => r(s));
            };
          }
          static _normalizeKey(e) {
            return "esc" === e ? "escape" : e;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Y));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const UD = [
          { provide: Vl, useValue: ED },
          {
            provide: SC,
            useValue: function sL() {
              Pf.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: Y,
            useFactory: function aL() {
              return (
                (function GI(n) {
                  Nd = n;
                })(document),
                document
              );
            },
            deps: [],
          },
        ],
        lL = PC(YP, "browser", UD),
        HD = new w(""),
        $D = [
          {
            provide: Bl,
            useClass: class W1 {
              addToWindow(t) {
                (Ee.getAngularTestability = (r, i = !0) => {
                  const s = t.findTestabilityInTree(r, i);
                  if (null == s)
                    throw new Error("Could not find testability for element.");
                  return s;
                }),
                  (Ee.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (Ee.getAllAngularRootElements = () => t.getAllRootElements()),
                  Ee.frameworkStabilizers || (Ee.frameworkStabilizers = []),
                  Ee.frameworkStabilizers.push((r) => {
                    const i = Ee.getAllAngularTestabilities();
                    let s = i.length,
                      o = !1;
                    const a = function (l) {
                      (o = o || l), s--, 0 == s && r(o);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, e, r) {
                return null == e
                  ? null
                  : t.getTestability(e) ??
                      (r
                        ? Fn().isShadowRoot(e)
                          ? this.findTestabilityInTree(t, e.host, !0)
                          : this.findTestabilityInTree(t, e.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: xC, useClass: af, deps: [le, lf, Bl] },
          { provide: af, useClass: af, deps: [le, lf, Bl] },
        ],
        zD = [
          { provide: zd, useValue: "root" },
          {
            provide: Yn,
            useFactory: function oL() {
              return new Yn();
            },
            deps: [],
          },
          { provide: nc, useClass: tL, multi: !0, deps: [Y, le, Vl] },
          { provide: nc, useClass: iL, multi: !0, deps: [Y] },
          { provide: sc, useClass: sc, deps: [rc, Lo, To] },
          { provide: lo, useExisting: sc },
          { provide: OD, useExisting: Lo },
          { provide: Lo, useClass: Lo, deps: [Y] },
          { provide: rc, useClass: rc, deps: [nc, le] },
          { provide: MD, useClass: q1, deps: [] },
          [],
        ];
      let GD = (() => {
          class n {
            constructor(e) {}
            static withServerTransition(e) {
              return {
                ngModule: n,
                providers: [
                  { provide: To, useValue: e.appId },
                  { provide: RD, useExisting: To },
                  G1,
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(HD, 12));
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ providers: [...zD, ...$D], imports: [wD, ZP] })),
            n
          );
        })(),
        WD = (() => {
          class n {
            constructor(e) {
              this._doc = e;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(e) {
              this._doc.title = e || "";
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y));
            }),
            (n.ɵprov = A({
              token: n,
              factory: function (e) {
                let r = null;
                return (
                  (r = e
                    ? new e()
                    : (function uL() {
                        return new WD(m(Y));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            n
          );
        })();
      typeof window < "u" && window;
      let Uf = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = A({
              token: n,
              factory: function (e) {
                let r = null;
                return (r = e ? new (e || n)() : m(YD)), r;
              },
              providedIn: "root",
            })),
            n
          );
        })(),
        YD = (() => {
          class n extends Uf {
            constructor(e) {
              super(), (this._doc = e);
            }
            sanitize(e, r) {
              if (null == r) return null;
              switch (e) {
                case pe.NONE:
                  return r;
                case pe.HTML:
                  return Mn(r, "HTML")
                    ? Bt(r)
                    : ry(this._doc, String(r)).toString();
                case pe.STYLE:
                  return Mn(r, "Style") ? Bt(r) : r;
                case pe.SCRIPT:
                  if (Mn(r, "Script")) return Bt(r);
                  throw new Error("unsafe value used in a script context");
                case pe.URL:
                  return Mn(r, "URL") ? Bt(r) : ll(String(r));
                case pe.RESOURCE_URL:
                  if (Mn(r, "ResourceURL")) return Bt(r);
                  throw new Error(
                    "unsafe value used in a resource URL context (see https://g.co/ng/security#xss)",
                  );
                default:
                  throw new Error(
                    `Unexpected SecurityContext ${e} (see https://g.co/ng/security#xss)`,
                  );
              }
            }
            bypassSecurityTrustHtml(e) {
              return (function XI(n) {
                return new WI(n);
              })(e);
            }
            bypassSecurityTrustStyle(e) {
              return (function JI(n) {
                return new qI(n);
              })(e);
            }
            bypassSecurityTrustScript(e) {
              return (function eR(n) {
                return new KI(n);
              })(e);
            }
            bypassSecurityTrustUrl(e) {
              return (function tR(n) {
                return new YI(n);
              })(e);
            }
            bypassSecurityTrustResourceUrl(e) {
              return (function nR(n) {
                return new ZI(n);
              })(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y));
            }),
            (n.ɵprov = A({
              token: n,
              factory: function (e) {
                let r = null;
                return (
                  (r = e
                    ? new e()
                    : (function _L(n) {
                        return new YD(n.get(Y));
                      })(m(Ne))),
                  r
                );
              },
              providedIn: "root",
            })),
            n
          );
        })();
      function ZD(...n) {
        if (1 === n.length) {
          const t = n[0];
          if (mi(t)) return oc(t, null);
          if (Ru(t) && Object.getPrototypeOf(t) === Object.prototype) {
            const e = Object.keys(t);
            return oc(
              e.map((r) => t[r]),
              e,
            );
          }
        }
        if ("function" == typeof n[n.length - 1]) {
          const t = n.pop();
          return oc((n = 1 === n.length && mi(n[0]) ? n[0] : n), null).pipe(
            U((e) => t(...e)),
          );
        }
        return oc(n, null);
      }
      function oc(n, t) {
        return new ye((e) => {
          const r = n.length;
          if (0 === r) return void e.complete();
          const i = new Array(r);
          let s = 0,
            o = 0;
          for (let a = 0; a < r; a++) {
            const l = ze(n[a]);
            let c = !1;
            e.add(
              l.subscribe({
                next: (u) => {
                  c || ((c = !0), o++), (i[a] = u);
                },
                error: (u) => e.error(u),
                complete: () => {
                  s++,
                    (s === r || !c) &&
                      (o === r &&
                        e.next(
                          t ? t.reduce((u, d, h) => ((u[d] = i[h]), u), {}) : i,
                        ),
                      e.complete());
                },
              }),
            );
          }
        });
      }
      let QD = (() => {
          class n {
            constructor(e, r) {
              (this._renderer = e),
                (this._elementRef = r),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {});
            }
            setProperty(e, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, e, r);
            }
            registerOnTouched(e) {
              this.onTouched = e;
            }
            registerOnChange(e) {
              this.onChange = e;
            }
            setDisabledState(e) {
              this.setProperty("disabled", e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Kn), _(Ie));
            }),
            (n.ɵdir = F({ type: n })),
            n
          );
        })(),
        Xr = (() => {
          class n extends QD {}
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = We(n)))(r || n);
              };
            })()),
            (n.ɵdir = F({ type: n, features: [ne] })),
            n
          );
        })();
      const Pn = new w("NgValueAccessor"),
        vL = { provide: Pn, useExisting: we(() => us), multi: !0 },
        CL = new w("CompositionEventMode");
      let us = (() => {
        class n extends QD {
          constructor(e, r, i) {
            super(e, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function bL() {
                  const n = Fn() ? Fn().getUserAgent() : "";
                  return /android (\d+)/.test(n.toLowerCase());
                })());
          }
          writeValue(e) {
            this.setProperty("value", e ?? "");
          }
          _handleInput(e) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(e);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(e) {
            (this._composing = !1), this._compositionMode && this.onChange(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(Kn), _(Ie), _(CL, 8));
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (e, r) {
              1 & e &&
                oe("input", function (s) {
                  return r._handleInput(s.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (s) {
                  return r._compositionEnd(s.target.value);
                });
            },
            features: [Ae([vL]), ne],
          })),
          n
        );
      })();
      const dt = new w("NgValidators"),
        Er = new w("NgAsyncValidators");
      function nw(n) {
        return (function wr(n) {
          return (
            null == n ||
            (("string" == typeof n || Array.isArray(n)) && 0 === n.length)
          );
        })(n.value)
          ? { required: !0 }
          : null;
      }
      function ac(n) {
        return null;
      }
      function lw(n) {
        return null != n;
      }
      function cw(n) {
        return go(n) ? ze(n) : n;
      }
      function uw(n) {
        let t = {};
        return (
          n.forEach((e) => {
            t = null != e ? { ...t, ...e } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function dw(n, t) {
        return t.map((e) => e(n));
      }
      function hw(n) {
        return n.map((t) =>
          (function EL(n) {
            return !n.validate;
          })(t)
            ? t
            : (e) => t.validate(e),
        );
      }
      function Hf(n) {
        return null != n
          ? (function fw(n) {
              if (!n) return null;
              const t = n.filter(lw);
              return 0 == t.length
                ? null
                : function (e) {
                    return uw(dw(e, t));
                  };
            })(hw(n))
          : null;
      }
      function $f(n) {
        return null != n
          ? (function pw(n) {
              if (!n) return null;
              const t = n.filter(lw);
              return 0 == t.length
                ? null
                : function (e) {
                    return ZD(dw(e, t).map(cw)).pipe(U(uw));
                  };
            })(hw(n))
          : null;
      }
      function gw(n, t) {
        return null === n ? [t] : Array.isArray(n) ? [...n, t] : [n, t];
      }
      function mw(n) {
        return n._rawValidators;
      }
      function _w(n) {
        return n._rawAsyncValidators;
      }
      function zf(n) {
        return n ? (Array.isArray(n) ? n : [n]) : [];
      }
      function lc(n, t) {
        return Array.isArray(n) ? n.includes(t) : n === t;
      }
      function yw(n, t) {
        const e = zf(t);
        return (
          zf(n).forEach((i) => {
            lc(e, i) || e.push(i);
          }),
          e
        );
      }
      function vw(n, t) {
        return zf(t).filter((e) => !lc(n, e));
      }
      class bw {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = Hf(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = $f(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, e) {
          return !!this.control && this.control.hasError(t, e);
        }
        getError(t, e) {
          return this.control ? this.control.getError(t, e) : null;
        }
      }
      class bt extends bw {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Sr extends bw {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class Cw {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let cc = (() => {
          class n extends Cw {
            constructor(e) {
              super(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Sr, 2));
            }),
            (n.ɵdir = F({
              type: n,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (e, r) {
                2 & e &&
                  Jn("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine,
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid,
                  )("ng-pending", r.isPending);
              },
              features: [ne],
            })),
            n
          );
        })(),
        uc = (() => {
          class n extends Cw {
            constructor(e) {
              super(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(bt, 10));
            }),
            (n.ɵdir = F({
              type: n,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (e, r) {
                2 & e &&
                  Jn("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine,
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid,
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [ne],
            })),
            n
          );
        })();
      const Vo = "VALID",
        hc = "INVALID",
        ds = "PENDING",
        Bo = "DISABLED";
      function Kf(n) {
        return (fc(n) ? n.validators : n) || null;
      }
      function ww(n) {
        return Array.isArray(n) ? Hf(n) : n || null;
      }
      function Yf(n, t) {
        return (fc(t) ? t.asyncValidators : n) || null;
      }
      function Ew(n) {
        return Array.isArray(n) ? $f(n) : n || null;
      }
      function fc(n) {
        return null != n && !Array.isArray(n) && "object" == typeof n;
      }
      function Sw(n, t, e) {
        const r = n.controls;
        if (!(t ? Object.keys(r) : r).length) throw new C(1e3, "");
        if (!r[e]) throw new C(1001, "");
      }
      function Mw(n, t, e) {
        n._forEachChild((r, i) => {
          if (void 0 === e[i]) throw new C(1002, "");
        });
      }
      class pc {
        constructor(t, e) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            (this._rawValidators = t),
            (this._rawAsyncValidators = e),
            (this._composedValidatorFn = ww(this._rawValidators)),
            (this._composedAsyncValidatorFn = Ew(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Vo;
        }
        get invalid() {
          return this.status === hc;
        }
        get pending() {
          return this.status == ds;
        }
        get disabled() {
          return this.status === Bo;
        }
        get enabled() {
          return this.status !== Bo;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
              ? this.parent.updateOn
              : "change";
        }
        setValidators(t) {
          (this._rawValidators = t), (this._composedValidatorFn = ww(t));
        }
        setAsyncValidators(t) {
          (this._rawAsyncValidators = t),
            (this._composedAsyncValidatorFn = Ew(t));
        }
        addValidators(t) {
          this.setValidators(yw(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(yw(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(vw(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(vw(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return lc(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return lc(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((e) => {
              e.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((e) => {
              e.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = ds),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const e = this._parentMarkedDirty(t.onlySelf);
          (this.status = Bo),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: e }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const e = this._parentMarkedDirty(t.onlySelf);
          (this.status = Vo),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: e }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Vo || this.status === ds) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((e) => e._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Bo : Vo;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = ds), (this._hasOwnPendingAsyncValidator = !0);
            const e = cw(this.asyncValidator(this));
            this._asyncValidationSubscription = e.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, e = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== e.emitEvent);
        }
        get(t) {
          let e = t;
          return null == e ||
            (Array.isArray(e) || (e = e.split(".")), 0 === e.length)
            ? null
            : e.reduce((r, i) => r && r._find(i), this);
        }
        getError(t, e) {
          const r = e ? this.get(e) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, e) {
          return !!this.getError(t, e);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new ae()), (this.statusChanges = new ae());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Bo
            : this.errors
              ? hc
              : this._hasOwnPendingAsyncValidator ||
                  this._anyControlsHaveStatus(ds)
                ? ds
                : this._anyControlsHaveStatus(hc)
                  ? hc
                  : Vo;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((e) => e.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          fc(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
      }
      class jo extends pc {
        constructor(t, e, r) {
          super(Kf(e), Yf(r, e)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(e),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, e) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = e),
              e.setParent(this),
              e._registerOnCollectionChange(this._onCollectionChange),
              e);
        }
        addControl(t, e, r = {}) {
          this.registerControl(t, e),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, e = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: e.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, e, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            e && this.registerControl(t, e),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, e = {}) {
          Mw(this, 0, t),
            Object.keys(t).forEach((r) => {
              Sw(this, !0, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: e.emitEvent,
                });
            }),
            this.updateValueAndValidity(e);
        }
        patchValue(t, e = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              const i = this.controls[r];
              i && i.patchValue(t[r], { onlySelf: !0, emitEvent: e.emitEvent });
            }),
            this.updateValueAndValidity(e));
        }
        reset(t = {}, e = {}) {
          this._forEachChild((r, i) => {
            r.reset(t[i], { onlySelf: !0, emitEvent: e.emitEvent });
          }),
            this._updatePristine(e),
            this._updateTouched(e),
            this.updateValueAndValidity(e);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (t, e, r) => ((t[r] = e.getRawValue()), t),
          );
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (e, r) => !!r._syncPendingControls() || e,
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((e) => {
            const r = this.controls[e];
            r && t(r, e);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const [e, r] of Object.entries(this.controls))
            if (this.contains(e) && t(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (e, r, i) => ((r.enabled || this.disabled) && (e[i] = r.value), e),
          );
        }
        _reduceChildren(t, e) {
          let r = t;
          return (
            this._forEachChild((i, s) => {
              r = e(r, i, s);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(t) {
          return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
        }
      }
      class Aw extends jo {}
      function Uo(n, t) {
        Zf(n, t),
          t.valueAccessor.writeValue(n.value),
          n.disabled && t.valueAccessor.setDisabledState?.(!0),
          (function OL(n, t) {
            t.valueAccessor.registerOnChange((e) => {
              (n._pendingValue = e),
                (n._pendingChange = !0),
                (n._pendingDirty = !0),
                "change" === n.updateOn && Tw(n, t);
            });
          })(n, t),
          (function FL(n, t) {
            const e = (r, i) => {
              t.valueAccessor.writeValue(r), i && t.viewToModelUpdate(r);
            };
            n.registerOnChange(e),
              t._registerOnDestroy(() => {
                n._unregisterOnChange(e);
              });
          })(n, t),
          (function kL(n, t) {
            t.valueAccessor.registerOnTouched(() => {
              (n._pendingTouched = !0),
                "blur" === n.updateOn && n._pendingChange && Tw(n, t),
                "submit" !== n.updateOn && n.markAsTouched();
            });
          })(n, t),
          (function xL(n, t) {
            if (t.valueAccessor.setDisabledState) {
              const e = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              n.registerOnDisabledChange(e),
                t._registerOnDestroy(() => {
                  n._unregisterOnDisabledChange(e);
                });
            }
          })(n, t);
      }
      function mc(n, t, e = !0) {
        const r = () => {};
        t.valueAccessor &&
          (t.valueAccessor.registerOnChange(r),
          t.valueAccessor.registerOnTouched(r)),
          yc(n, t),
          n &&
            (t._invokeOnDestroyCallbacks(),
            n._registerOnCollectionChange(() => {}));
      }
      function _c(n, t) {
        n.forEach((e) => {
          e.registerOnValidatorChange && e.registerOnValidatorChange(t);
        });
      }
      function Zf(n, t) {
        const e = mw(n);
        null !== t.validator
          ? n.setValidators(gw(e, t.validator))
          : "function" == typeof e && n.setValidators([e]);
        const r = _w(n);
        null !== t.asyncValidator
          ? n.setAsyncValidators(gw(r, t.asyncValidator))
          : "function" == typeof r && n.setAsyncValidators([r]);
        const i = () => n.updateValueAndValidity();
        _c(t._rawValidators, i), _c(t._rawAsyncValidators, i);
      }
      function yc(n, t) {
        let e = !1;
        if (null !== n) {
          if (null !== t.validator) {
            const i = mw(n);
            if (Array.isArray(i) && i.length > 0) {
              const s = i.filter((o) => o !== t.validator);
              s.length !== i.length && ((e = !0), n.setValidators(s));
            }
          }
          if (null !== t.asyncValidator) {
            const i = _w(n);
            if (Array.isArray(i) && i.length > 0) {
              const s = i.filter((o) => o !== t.asyncValidator);
              s.length !== i.length && ((e = !0), n.setAsyncValidators(s));
            }
          }
        }
        const r = () => {};
        return _c(t._rawValidators, r), _c(t._rawAsyncValidators, r), e;
      }
      function Tw(n, t) {
        n._pendingDirty && n.markAsDirty(),
          n.setValue(n._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(n._pendingValue),
          (n._pendingChange = !1);
      }
      function Ow(n, t) {
        const e = n.indexOf(t);
        e > -1 && n.splice(e, 1);
      }
      function kw(n) {
        return (
          "object" == typeof n &&
          null !== n &&
          2 === Object.keys(n).length &&
          "value" in n &&
          "disabled" in n
        );
      }
      const $o = class extends pc {
        constructor(t = null, e, r) {
          super(Kf(e), Yf(r, e)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(t),
            this._setUpdateStrategy(e),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            fc(e) &&
              (e.nonNullable || e.initialValueIsDefault) &&
              (this.defaultValue = kw(t) ? t.value : t);
        }
        setValue(t, e = {}) {
          (this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== e.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== e.emitViewToModelChange),
              ),
            this.updateValueAndValidity(e);
        }
        patchValue(t, e = {}) {
          this.setValue(t, e);
        }
        reset(t = this.defaultValue, e = {}) {
          this._applyFormState(t),
            this.markAsPristine(e),
            this.markAsUntouched(e),
            this.setValue(this.value, e),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(t) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(t) {
          this._onChange.push(t);
        }
        _unregisterOnChange(t) {
          Ow(this._onChange, t);
        }
        registerOnDisabledChange(t) {
          this._onDisabledChange.push(t);
        }
        _unregisterOnDisabledChange(t) {
          Ow(this._onDisabledChange, t);
        }
        _forEachChild(t) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(t) {
          kw(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t);
        }
      };
      let vc = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
            hostAttrs: ["novalidate", ""],
          })),
          n
        );
      })();
      const $L = { provide: Pn, useExisting: we(() => ep), multi: !0 };
      let ep = (() => {
          class n extends Xr {
            writeValue(e) {
              this.setProperty("value", e ?? "");
            }
            registerOnChange(e) {
              this.onChange = (r) => {
                e("" == r ? null : parseFloat(r));
              };
            }
          }
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = We(n)))(r || n);
              };
            })()),
            (n.ɵdir = F({
              type: n,
              selectors: [
                ["input", "type", "number", "formControlName", ""],
                ["input", "type", "number", "formControl", ""],
                ["input", "type", "number", "ngModel", ""],
              ],
              hostBindings: function (e, r) {
                1 & e &&
                  oe("input", function (s) {
                    return r.onChange(s.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              features: [Ae([$L]), ne],
            })),
            n
          );
        })(),
        Vw = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })();
      const tp = new w("NgModelWithFormControlWarning"),
        KL = { provide: bt, useExisting: we(() => hs) };
      let hs = (() => {
        class n extends bt {
          constructor(e, r) {
            super(),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new ae()),
              this._setValidators(e),
              this._setAsyncValidators(r);
          }
          ngOnChanges(e) {
            this._checkFormPresent(),
              e.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (yc(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(e) {
            const r = this.form.get(e.path);
            return (
              Uo(r, e),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(e),
              r
            );
          }
          getControl(e) {
            return this.form.get(e.path);
          }
          removeControl(e) {
            mc(e.control || null, e, !1),
              (function VL(n, t) {
                const e = n.indexOf(t);
                e > -1 && n.splice(e, 1);
              })(this.directives, e);
          }
          addFormGroup(e) {
            this._setUpFormContainer(e);
          }
          removeFormGroup(e) {
            this._cleanUpFormContainer(e);
          }
          getFormGroup(e) {
            return this.form.get(e.path);
          }
          addFormArray(e) {
            this._setUpFormContainer(e);
          }
          removeFormArray(e) {
            this._cleanUpFormContainer(e);
          }
          getFormArray(e) {
            return this.form.get(e.path);
          }
          updateModel(e, r) {
            this.form.get(e.path).setValue(r);
          }
          onSubmit(e) {
            return (
              (this.submitted = !0),
              (function xw(n, t) {
                n._syncPendingControls(),
                  t.forEach((e) => {
                    const r = e.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (e.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(e),
              "dialog" === e?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(e) {
            this.form.reset(e), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((e) => {
              const r = e.control,
                i = this.form.get(e.path);
              r !== i &&
                (mc(r || null, e),
                ((n) => n instanceof $o)(i) && (Uo(i, e), (e.control = i)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(e) {
            const r = this.form.get(e.path);
            (function Iw(n, t) {
              Zf(n, t);
            })(r, e),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(e) {
            if (this.form) {
              const r = this.form.get(e.path);
              r &&
                (function PL(n, t) {
                  return yc(n, t);
                })(r, e) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            Zf(this.form, this), this._oldForm && yc(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(dt, 10), _(Er, 10));
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (e, r) {
              1 & e &&
                oe("submit", function (s) {
                  return r.onSubmit(s);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [Ae([KL]), ne, Xt],
          })),
          n
        );
      })();
      const QL = { provide: Sr, useExisting: we(() => zo) };
      let zo = (() => {
        class n extends Sr {
          constructor(e, r, i, s, o) {
            super(),
              (this._ngModelWarningConfig = o),
              (this._added = !1),
              (this.update = new ae()),
              (this._ngModelWarningSent = !1),
              (this._parent = e),
              this._setValidators(r),
              this._setAsyncValidators(i),
              (this.valueAccessor = (function Xf(n, t) {
                if (!t) return null;
                let e, r, i;
                return (
                  Array.isArray(t),
                  t.forEach((s) => {
                    s.constructor === us
                      ? (e = s)
                      : (function LL(n) {
                            return Object.getPrototypeOf(n.constructor) === Xr;
                          })(s)
                        ? (r = s)
                        : (i = s);
                  }),
                  i || r || e || null
                );
              })(0, s));
          }
          set isDisabled(e) {}
          ngOnChanges(e) {
            this._added || this._setUpControl(),
              (function Qf(n, t) {
                if (!n.hasOwnProperty("model")) return !1;
                const e = n.model;
                return !!e.isFirstChange() || !Object.is(t, e.currentValue);
              })(e, this.viewModel) &&
                ((this.viewModel = this.model),
                this.formDirective.updateModel(this, this.model));
          }
          ngOnDestroy() {
            this.formDirective && this.formDirective.removeControl(this);
          }
          viewToModelUpdate(e) {
            (this.viewModel = e), this.update.emit(e);
          }
          get path() {
            return (function gc(n, t) {
              return [...t.path, n];
            })(
              null == this.name ? this.name : this.name.toString(),
              this._parent,
            );
          }
          get formDirective() {
            return this._parent ? this._parent.formDirective : null;
          }
          _checkParentType() {}
          _setUpControl() {
            this._checkParentType(),
              (this.control = this.formDirective.addControl(this)),
              (this._added = !0);
          }
        }
        return (
          (n._ngModelWarningSentOnce = !1),
          (n.ɵfac = function (e) {
            return new (e || n)(
              _(bt, 13),
              _(dt, 10),
              _(Er, 10),
              _(Pn, 10),
              _(tp, 8),
            );
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [["", "formControlName", ""]],
            inputs: {
              name: ["formControlName", "name"],
              isDisabled: ["disabled", "isDisabled"],
              model: ["ngModel", "model"],
            },
            outputs: { update: "ngModelChange" },
            features: [Ae([QL]), ne, Xt],
          })),
          n
        );
      })();
      const XL = { provide: Pn, useExisting: we(() => fs), multi: !0 };
      function $w(n, t) {
        return null == n
          ? `${t}`
          : (t && "object" == typeof t && (t = "Object"),
            `${n}: ${t}`.slice(0, 50));
      }
      let fs = (() => {
          class n extends Xr {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(e) {
              this._compareWith = e;
            }
            writeValue(e) {
              this.value = e;
              const i = $w(this._getOptionId(e), e);
              this.setProperty("value", i);
            }
            registerOnChange(e) {
              this.onChange = (r) => {
                (this.value = this._getOptionValue(r)), e(this.value);
              };
            }
            _registerOption() {
              return (this._idCounter++).toString();
            }
            _getOptionId(e) {
              for (const r of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(r), e)) return r;
              return null;
            }
            _getOptionValue(e) {
              const r = (function JL(n) {
                return n.split(":")[0];
              })(e);
              return this._optionMap.has(r) ? this._optionMap.get(r) : e;
            }
          }
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = We(n)))(r || n);
              };
            })()),
            (n.ɵdir = F({
              type: n,
              selectors: [
                ["select", "formControlName", "", 3, "multiple", ""],
                ["select", "formControl", "", 3, "multiple", ""],
                ["select", "ngModel", "", 3, "multiple", ""],
              ],
              hostBindings: function (e, r) {
                1 & e &&
                  oe("change", function (s) {
                    return r.onChange(s.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [Ae([XL]), ne],
            })),
            n
          );
        })(),
        bc = (() => {
          class n {
            constructor(e, r, i) {
              (this._element = e),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption());
            }
            set ngValue(e) {
              null != this._select &&
                (this._select._optionMap.set(this.id, e),
                this._setElementValue($w(this.id, e)),
                this._select.writeValue(this._select.value));
            }
            set value(e) {
              this._setElementValue(e),
                this._select && this._select.writeValue(this._select.value);
            }
            _setElementValue(e) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                e,
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Ie), _(Kn), _(fs, 9));
            }),
            (n.ɵdir = F({
              type: n,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            n
          );
        })();
      const eV = { provide: Pn, useExisting: we(() => ip), multi: !0 };
      function zw(n, t) {
        return null == n
          ? `${t}`
          : ("string" == typeof t && (t = `'${t}'`),
            t && "object" == typeof t && (t = "Object"),
            `${n}: ${t}`.slice(0, 50));
      }
      let ip = (() => {
          class n extends Xr {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(e) {
              this._compareWith = e;
            }
            writeValue(e) {
              let r;
              if (((this.value = e), Array.isArray(e))) {
                const i = e.map((s) => this._getOptionId(s));
                r = (s, o) => {
                  s._setSelected(i.indexOf(o.toString()) > -1);
                };
              } else
                r = (i, s) => {
                  i._setSelected(!1);
                };
              this._optionMap.forEach(r);
            }
            registerOnChange(e) {
              this.onChange = (r) => {
                const i = [],
                  s = r.selectedOptions;
                if (void 0 !== s) {
                  const o = s;
                  for (let a = 0; a < o.length; a++) {
                    const c = this._getOptionValue(o[a].value);
                    i.push(c);
                  }
                } else {
                  const o = r.options;
                  for (let a = 0; a < o.length; a++) {
                    const l = o[a];
                    if (l.selected) {
                      const c = this._getOptionValue(l.value);
                      i.push(c);
                    }
                  }
                }
                (this.value = i), e(i);
              };
            }
            _registerOption(e) {
              const r = (this._idCounter++).toString();
              return this._optionMap.set(r, e), r;
            }
            _getOptionId(e) {
              for (const r of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(r)._value, e))
                  return r;
              return null;
            }
            _getOptionValue(e) {
              const r = (function tV(n) {
                return n.split(":")[0];
              })(e);
              return this._optionMap.has(r) ? this._optionMap.get(r)._value : e;
            }
          }
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = We(n)))(r || n);
              };
            })()),
            (n.ɵdir = F({
              type: n,
              selectors: [
                ["select", "multiple", "", "formControlName", ""],
                ["select", "multiple", "", "formControl", ""],
                ["select", "multiple", "", "ngModel", ""],
              ],
              hostBindings: function (e, r) {
                1 & e &&
                  oe("change", function (s) {
                    return r.onChange(s.target);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [Ae([eV]), ne],
            })),
            n
          );
        })(),
        Cc = (() => {
          class n {
            constructor(e, r, i) {
              (this._element = e),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption(this));
            }
            set ngValue(e) {
              null != this._select &&
                ((this._value = e),
                this._setElementValue(zw(this.id, e)),
                this._select.writeValue(this._select.value));
            }
            set value(e) {
              this._select
                ? ((this._value = e),
                  this._setElementValue(zw(this.id, e)),
                  this._select.writeValue(this._select.value))
                : this._setElementValue(e);
            }
            _setElementValue(e) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                e,
              );
            }
            _setSelected(e) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "selected",
                e,
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Ie), _(Kn), _(ip, 9));
            }),
            (n.ɵdir = F({
              type: n,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            n
          );
        })(),
        Jr = (() => {
          class n {
            constructor() {
              this._validator = ac;
            }
            ngOnChanges(e) {
              if (this.inputName in e) {
                const r = this.normalizeInput(e[this.inputName].currentValue);
                (this._enabled = this.enabled(r)),
                  (this._validator = this._enabled
                    ? this.createValidator(r)
                    : ac),
                  this._onChange && this._onChange();
              }
            }
            validate(e) {
              return this._validator(e);
            }
            registerOnValidatorChange(e) {
              this._onChange = e;
            }
            enabled(e) {
              return null != e;
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵdir = F({ type: n, features: [Xt] })),
            n
          );
        })();
      const iV = { provide: dt, useExisting: we(() => ps), multi: !0 };
      let ps = (() => {
          class n extends Jr {
            constructor() {
              super(...arguments),
                (this.inputName = "required"),
                (this.normalizeInput = tr),
                (this.createValidator = (e) => nw);
            }
            enabled(e) {
              return e;
            }
          }
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = We(n)))(r || n);
              };
            })()),
            (n.ɵdir = F({
              type: n,
              selectors: [
                [
                  "",
                  "required",
                  "",
                  "formControlName",
                  "",
                  3,
                  "type",
                  "checkbox",
                ],
                ["", "required", "", "formControl", "", 3, "type", "checkbox"],
                ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
              ],
              hostVars: 1,
              hostBindings: function (e, r) {
                2 & e && et("required", r._enabled ? "" : null);
              },
              inputs: { required: "required" },
              features: [Ae([iV]), ne],
            })),
            n
          );
        })(),
        eE = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ imports: [Vw] })),
            n
          );
        })(),
        uV = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ imports: [eE] })),
            n
          );
        })(),
        tE = (() => {
          class n {
            static withConfig(e) {
              return {
                ngModule: n,
                providers: [
                  { provide: tp, useValue: e.warnOnNgModelWithFormControl },
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ imports: [eE] })),
            n
          );
        })();
      class nE extends pc {
        constructor(t, e, r) {
          super(Kf(e), Yf(r, e)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(e),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(t) {
          return this.controls[this._adjustIndex(t)];
        }
        push(t, e = {}) {
          this.controls.push(t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: e.emitEvent }),
            this._onCollectionChange();
        }
        insert(t, e, r = {}) {
          this.controls.splice(t, 0, e),
            this._registerControl(e),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(t, e = {}) {
          let r = this._adjustIndex(t);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: e.emitEvent });
        }
        setControl(t, e, r = {}) {
          let i = this._adjustIndex(t);
          i < 0 && (i = 0),
            this.controls[i] &&
              this.controls[i]._registerOnCollectionChange(() => {}),
            this.controls.splice(i, 1),
            e && (this.controls.splice(i, 0, e), this._registerControl(e)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(t, e = {}) {
          Mw(this, 0, t),
            t.forEach((r, i) => {
              Sw(this, !1, i),
                this.at(i).setValue(r, {
                  onlySelf: !0,
                  emitEvent: e.emitEvent,
                });
            }),
            this.updateValueAndValidity(e);
        }
        patchValue(t, e = {}) {
          null != t &&
            (t.forEach((r, i) => {
              this.at(i) &&
                this.at(i).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: e.emitEvent,
                });
            }),
            this.updateValueAndValidity(e));
        }
        reset(t = [], e = {}) {
          this._forEachChild((r, i) => {
            r.reset(t[i], { onlySelf: !0, emitEvent: e.emitEvent });
          }),
            this._updatePristine(e),
            this._updateTouched(e),
            this.updateValueAndValidity(e);
        }
        getRawValue() {
          return this.controls.map((t) => t.getRawValue());
        }
        clear(t = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((e) => e._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }));
        }
        _adjustIndex(t) {
          return t < 0 ? t + this.length : t;
        }
        _syncPendingControls() {
          let t = this.controls.reduce(
            (e, r) => !!r._syncPendingControls() || e,
            !1,
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          this.controls.forEach((e, r) => {
            t(e, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((t) => t.enabled || this.disabled)
            .map((t) => t.value);
        }
        _anyControls(t) {
          return this.controls.some((e) => e.enabled && t(e));
        }
        _setUpControls() {
          this._forEachChild((t) => this._registerControl(t));
        }
        _allControlsDisabled() {
          for (const t of this.controls) if (t.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(t) {
          t.setParent(this),
            t._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(t) {
          return this.at(t) ?? null;
        }
      }
      function rE(n) {
        return (
          !!n &&
          (void 0 !== n.asyncValidators ||
            void 0 !== n.validators ||
            void 0 !== n.updateOn)
        );
      }
      let sp = (() => {
        class n {
          constructor() {
            this.useNonNullable = !1;
          }
          get nonNullable() {
            const e = new n();
            return (e.useNonNullable = !0), e;
          }
          group(e, r = null) {
            const i = this._reduceControls(e);
            let s = {};
            return (
              rE(r)
                ? (s = r)
                : null !== r &&
                  ((s.validators = r.validator),
                  (s.asyncValidators = r.asyncValidator)),
              new jo(i, s)
            );
          }
          record(e, r = null) {
            const i = this._reduceControls(e);
            return new Aw(i, r);
          }
          control(e, r, i) {
            let s = {};
            return this.useNonNullable
              ? (rE(r)
                  ? (s = r)
                  : ((s.validators = r), (s.asyncValidators = i)),
                new $o(e, { ...s, nonNullable: !0 }))
              : new $o(e, r, i);
          }
          array(e, r, i) {
            const s = e.map((o) => this._createControl(o));
            return new nE(s, r, i);
          }
          _reduceControls(e) {
            const r = {};
            return (
              Object.keys(e).forEach((i) => {
                r[i] = this._createControl(e[i]);
              }),
              r
            );
          }
          _createControl(e) {
            return e instanceof $o || e instanceof pc
              ? e
              : Array.isArray(e)
                ? this.control(
                    e[0],
                    e.length > 1 ? e[1] : null,
                    e.length > 2 ? e[2] : null,
                  )
                : this.control(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: tE })),
          n
        );
      })();
      function k(...n) {
        let t = n[n.length - 1];
        return yi(t) ? (n.pop(), Ou(n, t)) : ku(n);
      }
      function Mr(n, t) {
        return st(n, t, 1);
      }
      function Ze(n, t) {
        return function (r) {
          return r.lift(new dV(n, t));
        };
      }
      class dV {
        constructor(t, e) {
          (this.predicate = t), (this.thisArg = e);
        }
        call(t, e) {
          return e.subscribe(new hV(t, this.predicate, this.thisArg));
        }
      }
      class hV extends ge {
        constructor(t, e, r) {
          super(t), (this.predicate = e), (this.thisArg = r), (this.count = 0);
        }
        _next(t) {
          let e;
          try {
            e = this.predicate.call(this.thisArg, t, this.count++);
          } catch (r) {
            return void this.destination.error(r);
          }
          e && this.destination.next(t);
        }
      }
      class iE {}
      class sE {}
      class ir {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  "string" == typeof t
                    ? () => {
                        (this.headers = new Map()),
                          t.split("\n").forEach((e) => {
                            const r = e.indexOf(":");
                            if (r > 0) {
                              const i = e.slice(0, r),
                                s = i.toLowerCase(),
                                o = e.slice(r + 1).trim();
                              this.maybeSetNormalizedName(i, s),
                                this.headers.has(s)
                                  ? this.headers.get(s).push(o)
                                  : this.headers.set(s, [o]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(t).forEach((e) => {
                            let r = t[e];
                            const i = e.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(i, r),
                                this.maybeSetNormalizedName(e, i));
                          });
                      })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const e = this.headers.get(t.toLowerCase());
          return e && e.length > 0 ? e[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, e) {
          return this.clone({ name: t, value: e, op: "a" });
        }
        set(t, e) {
          return this.clone({ name: t, value: e, op: "s" });
        }
        delete(t, e) {
          return this.clone({ name: t, value: e, op: "d" });
        }
        maybeSetNormalizedName(t, e) {
          this.normalizedNames.has(e) || this.normalizedNames.set(e, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof ir
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((e) => {
              this.headers.set(e, t.headers.get(e)),
                this.normalizedNames.set(e, t.normalizedNames.get(e));
            });
        }
        clone(t) {
          const e = new ir();
          return (
            (e.lazyInit =
              this.lazyInit && this.lazyInit instanceof ir
                ? this.lazyInit
                : this),
            (e.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            e
          );
        }
        applyUpdate(t) {
          const e = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, e);
              const i = ("a" === t.op ? this.headers.get(e) : void 0) || [];
              i.push(...r), this.headers.set(e, i);
              break;
            case "d":
              const s = t.value;
              if (s) {
                let o = this.headers.get(e);
                if (!o) return;
                (o = o.filter((a) => -1 === s.indexOf(a))),
                  0 === o.length
                    ? (this.headers.delete(e), this.normalizedNames.delete(e))
                    : this.headers.set(e, o);
              } else this.headers.delete(e), this.normalizedNames.delete(e);
          }
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((e) =>
              t(this.normalizedNames.get(e), this.headers.get(e)),
            );
        }
      }
      class fV {
        encodeKey(t) {
          return oE(t);
        }
        encodeValue(t) {
          return oE(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const gV = /%(\d[a-f0-9])/gi,
        mV = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function oE(n) {
        return encodeURIComponent(n).replace(gV, (t, e) => mV[e] ?? t);
      }
      function Dc(n) {
        return `${n}`;
      }
      class Ar {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new fV()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function pV(n, t) {
              const e = new Map();
              return (
                n.length > 0 &&
                  n
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((i) => {
                      const s = i.indexOf("="),
                        [o, a] =
                          -1 == s
                            ? [t.decodeKey(i), ""]
                            : [
                                t.decodeKey(i.slice(0, s)),
                                t.decodeValue(i.slice(s + 1)),
                              ],
                        l = e.get(o) || [];
                      l.push(a), e.set(o, l);
                    }),
                e
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((e) => {
                  const r = t.fromObject[e],
                    i = Array.isArray(r) ? r.map(Dc) : [Dc(r)];
                  this.map.set(e, i);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const e = this.map.get(t);
          return e ? e[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, e) {
          return this.clone({ param: t, value: e, op: "a" });
        }
        appendAll(t) {
          const e = [];
          return (
            Object.keys(t).forEach((r) => {
              const i = t[r];
              Array.isArray(i)
                ? i.forEach((s) => {
                    e.push({ param: r, value: s, op: "a" });
                  })
                : e.push({ param: r, value: i, op: "a" });
            }),
            this.clone(e)
          );
        }
        set(t, e) {
          return this.clone({ param: t, value: e, op: "s" });
        }
        delete(t, e) {
          return this.clone({ param: t, value: e, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const e = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => e + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const e = new Ar({ encoder: this.encoder });
          return (
            (e.cloneFrom = this.cloneFrom || this),
            (e.updates = (this.updates || []).concat(t)),
            e
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const e =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    e.push(Dc(t.value)), this.map.set(t.param, e);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const i = r.indexOf(Dc(t.value));
                      -1 !== i && r.splice(i, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class _V {
        constructor() {
          this.map = new Map();
        }
        set(t, e) {
          return this.map.set(t, e), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function aE(n) {
        return typeof ArrayBuffer < "u" && n instanceof ArrayBuffer;
      }
      function lE(n) {
        return typeof Blob < "u" && n instanceof Blob;
      }
      function cE(n) {
        return typeof FormData < "u" && n instanceof FormData;
      }
      class Go {
        constructor(t, e, r, i) {
          let s;
          if (
            ((this.url = e),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function yV(n) {
              switch (n) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (s = i))
              : (s = r),
            s &&
              ((this.reportProgress = !!s.reportProgress),
              (this.withCredentials = !!s.withCredentials),
              s.responseType && (this.responseType = s.responseType),
              s.headers && (this.headers = s.headers),
              s.context && (this.context = s.context),
              s.params && (this.params = s.params)),
            this.headers || (this.headers = new ir()),
            this.context || (this.context = new _V()),
            this.params)
          ) {
            const o = this.params.toString();
            if (0 === o.length) this.urlWithParams = e;
            else {
              const a = e.indexOf("?");
              this.urlWithParams =
                e + (-1 === a ? "?" : a < e.length - 1 ? "&" : "") + o;
            }
          } else (this.params = new Ar()), (this.urlWithParams = e);
        }
        serializeBody() {
          return null === this.body
            ? null
            : aE(this.body) ||
                lE(this.body) ||
                cE(this.body) ||
                (function vV(n) {
                  return (
                    typeof URLSearchParams < "u" && n instanceof URLSearchParams
                  );
                })(this.body) ||
                "string" == typeof this.body
              ? this.body
              : this.body instanceof Ar
                ? this.body.toString()
                : "object" == typeof this.body ||
                    "boolean" == typeof this.body ||
                    Array.isArray(this.body)
                  ? JSON.stringify(this.body)
                  : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || cE(this.body)
            ? null
            : lE(this.body)
              ? this.body.type || null
              : aE(this.body)
                ? null
                : "string" == typeof this.body
                  ? "text/plain"
                  : this.body instanceof Ar
                    ? "application/x-www-form-urlencoded;charset=UTF-8"
                    : "object" == typeof this.body ||
                        "number" == typeof this.body ||
                        "boolean" == typeof this.body
                      ? "application/json"
                      : null;
        }
        clone(t = {}) {
          const e = t.method || this.method,
            r = t.url || this.url,
            i = t.responseType || this.responseType,
            s = void 0 !== t.body ? t.body : this.body,
            o =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            a =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let l = t.headers || this.headers,
            c = t.params || this.params;
          const u = t.context ?? this.context;
          return (
            void 0 !== t.setHeaders &&
              (l = Object.keys(t.setHeaders).reduce(
                (d, h) => d.set(h, t.setHeaders[h]),
                l,
              )),
            t.setParams &&
              (c = Object.keys(t.setParams).reduce(
                (d, h) => d.set(h, t.setParams[h]),
                c,
              )),
            new Go(e, r, s, {
              params: c,
              headers: l,
              context: u,
              reportProgress: a,
              responseType: i,
              withCredentials: o,
            })
          );
        }
      }
      var Ue = (() => (
        ((Ue = Ue || {})[(Ue.Sent = 0)] = "Sent"),
        (Ue[(Ue.UploadProgress = 1)] = "UploadProgress"),
        (Ue[(Ue.ResponseHeader = 2)] = "ResponseHeader"),
        (Ue[(Ue.DownloadProgress = 3)] = "DownloadProgress"),
        (Ue[(Ue.Response = 4)] = "Response"),
        (Ue[(Ue.User = 5)] = "User"),
        Ue
      ))();
      class op {
        constructor(t, e = 200, r = "OK") {
          (this.headers = t.headers || new ir()),
            (this.status = void 0 !== t.status ? t.status : e),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class ap extends op {
        constructor(t = {}) {
          super(t), (this.type = Ue.ResponseHeader);
        }
        clone(t = {}) {
          return new ap({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class wc extends op {
        constructor(t = {}) {
          super(t),
            (this.type = Ue.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new wc({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class uE extends op {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function lp(n, t) {
        return {
          body: t,
          headers: n.headers,
          context: n.context,
          observe: n.observe,
          params: n.params,
          reportProgress: n.reportProgress,
          responseType: n.responseType,
          withCredentials: n.withCredentials,
        };
      }
      let ei = (() => {
        class n {
          constructor(e) {
            this.handler = e;
          }
          request(e, r, i = {}) {
            let s;
            if (e instanceof Go) s = e;
            else {
              let l, c;
              (l = i.headers instanceof ir ? i.headers : new ir(i.headers)),
                i.params &&
                  (c =
                    i.params instanceof Ar
                      ? i.params
                      : new Ar({ fromObject: i.params })),
                (s = new Go(e, r, void 0 !== i.body ? i.body : null, {
                  headers: l,
                  context: i.context,
                  params: c,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || "json",
                  withCredentials: i.withCredentials,
                }));
            }
            const o = k(s).pipe(Mr((l) => this.handler.handle(l)));
            if (e instanceof Go || "events" === i.observe) return o;
            const a = o.pipe(Ze((l) => l instanceof wc));
            switch (i.observe || "body") {
              case "body":
                switch (s.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      U((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      }),
                    );
                  case "blob":
                    return a.pipe(
                      U((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      }),
                    );
                  case "text":
                    return a.pipe(
                      U((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      }),
                    );
                  default:
                    return a.pipe(U((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${i.observe}}`,
                );
            }
          }
          delete(e, r = {}) {
            return this.request("DELETE", e, r);
          }
          get(e, r = {}) {
            return this.request("GET", e, r);
          }
          head(e, r = {}) {
            return this.request("HEAD", e, r);
          }
          jsonp(e, r) {
            return this.request("JSONP", e, {
              params: new Ar().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(e, r = {}) {
            return this.request("OPTIONS", e, r);
          }
          patch(e, r, i = {}) {
            return this.request("PATCH", e, lp(i, r));
          }
          post(e, r, i = {}) {
            return this.request("POST", e, lp(i, r));
          }
          put(e, r, i = {}) {
            return this.request("PUT", e, lp(i, r));
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(iE));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class dE {
        constructor(t, e) {
          (this.next = t), (this.interceptor = e);
        }
        handle(t) {
          return this.interceptor.intercept(t, this.next);
        }
      }
      const hE = new w("HTTP_INTERCEPTORS");
      let bV = (() => {
        class n {
          intercept(e, r) {
            return r.handle(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const CV = /^\)\]\}',?\n/;
      let fE = (() => {
        class n {
          constructor(e) {
            this.xhrFactory = e;
          }
          handle(e) {
            if ("JSONP" === e.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed.",
              );
            return new ye((r) => {
              const i = this.xhrFactory.build();
              if (
                (i.open(e.method, e.urlWithParams),
                e.withCredentials && (i.withCredentials = !0),
                e.headers.forEach((f, p) => i.setRequestHeader(f, p.join(","))),
                e.headers.has("Accept") ||
                  i.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*",
                  ),
                !e.headers.has("Content-Type"))
              ) {
                const f = e.detectContentTypeHeader();
                null !== f && i.setRequestHeader("Content-Type", f);
              }
              if (e.responseType) {
                const f = e.responseType.toLowerCase();
                i.responseType = "json" !== f ? f : "text";
              }
              const s = e.serializeBody();
              let o = null;
              const a = () => {
                  if (null !== o) return o;
                  const f = i.statusText || "OK",
                    p = new ir(i.getAllResponseHeaders()),
                    g =
                      (function DV(n) {
                        return "responseURL" in n && n.responseURL
                          ? n.responseURL
                          : /^X-Request-URL:/m.test(n.getAllResponseHeaders())
                            ? n.getResponseHeader("X-Request-URL")
                            : null;
                      })(i) || e.url;
                  return (
                    (o = new ap({
                      headers: p,
                      status: i.status,
                      statusText: f,
                      url: g,
                    })),
                    o
                  );
                },
                l = () => {
                  let { headers: f, status: p, statusText: g, url: y } = a(),
                    b = null;
                  204 !== p &&
                    (b = typeof i.response > "u" ? i.responseText : i.response),
                    0 === p && (p = b ? 200 : 0);
                  let M = p >= 200 && p < 300;
                  if ("json" === e.responseType && "string" == typeof b) {
                    const v = b;
                    b = b.replace(CV, "");
                    try {
                      b = "" !== b ? JSON.parse(b) : null;
                    } catch (T) {
                      (b = v), M && ((M = !1), (b = { error: T, text: b }));
                    }
                  }
                  M
                    ? (r.next(
                        new wc({
                          body: b,
                          headers: f,
                          status: p,
                          statusText: g,
                          url: y || void 0,
                        }),
                      ),
                      r.complete())
                    : r.error(
                        new uE({
                          error: b,
                          headers: f,
                          status: p,
                          statusText: g,
                          url: y || void 0,
                        }),
                      );
                },
                c = (f) => {
                  const { url: p } = a(),
                    g = new uE({
                      error: f,
                      status: i.status || 0,
                      statusText: i.statusText || "Unknown Error",
                      url: p || void 0,
                    });
                  r.error(g);
                };
              let u = !1;
              const d = (f) => {
                  u || (r.next(a()), (u = !0));
                  let p = { type: Ue.DownloadProgress, loaded: f.loaded };
                  f.lengthComputable && (p.total = f.total),
                    "text" === e.responseType &&
                      !!i.responseText &&
                      (p.partialText = i.responseText),
                    r.next(p);
                },
                h = (f) => {
                  let p = { type: Ue.UploadProgress, loaded: f.loaded };
                  f.lengthComputable && (p.total = f.total), r.next(p);
                };
              return (
                i.addEventListener("load", l),
                i.addEventListener("error", c),
                i.addEventListener("timeout", c),
                i.addEventListener("abort", c),
                e.reportProgress &&
                  (i.addEventListener("progress", d),
                  null !== s &&
                    i.upload &&
                    i.upload.addEventListener("progress", h)),
                i.send(s),
                r.next({ type: Ue.Sent }),
                () => {
                  i.removeEventListener("error", c),
                    i.removeEventListener("abort", c),
                    i.removeEventListener("load", l),
                    i.removeEventListener("timeout", c),
                    e.reportProgress &&
                      (i.removeEventListener("progress", d),
                      null !== s &&
                        i.upload &&
                        i.upload.removeEventListener("progress", h)),
                    i.readyState !== i.DONE && i.abort();
                }
              );
            });
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(MD));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const cp = new w("XSRF_COOKIE_NAME"),
        up = new w("XSRF_HEADER_NAME");
      class pE {}
      let wV = (() => {
          class n {
            constructor(e, r, i) {
              (this.doc = e),
                (this.platform = r),
                (this.cookieName = i),
                (this.lastCookieString = ""),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ("server" === this.platform) return null;
              const e = this.doc.cookie || "";
              return (
                e !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = pD(e, this.cookieName)),
                  (this.lastCookieString = e)),
                this.lastToken
              );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y), m(Vl), m(cp));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        dp = (() => {
          class n {
            constructor(e, r) {
              (this.tokenService = e), (this.headerName = r);
            }
            intercept(e, r) {
              const i = e.url.toLowerCase();
              if (
                "GET" === e.method ||
                "HEAD" === e.method ||
                i.startsWith("http://") ||
                i.startsWith("https://")
              )
                return r.handle(e);
              const s = this.tokenService.getToken();
              return (
                null !== s &&
                  !e.headers.has(this.headerName) &&
                  (e = e.clone({ headers: e.headers.set(this.headerName, s) })),
                r.handle(e)
              );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(pE), m(up));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        EV = (() => {
          class n {
            constructor(e, r) {
              (this.backend = e), (this.injector = r), (this.chain = null);
            }
            handle(e) {
              if (null === this.chain) {
                const r = this.injector.get(hE, []);
                this.chain = r.reduceRight(
                  (i, s) => new dE(i, s),
                  this.backend,
                );
              }
              return this.chain.handle(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(sE), m(Ne));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        SV = (() => {
          class n {
            static disable() {
              return {
                ngModule: n,
                providers: [{ provide: dp, useClass: bV }],
              };
            }
            static withOptions(e = {}) {
              return {
                ngModule: n,
                providers: [
                  e.cookieName ? { provide: cp, useValue: e.cookieName } : [],
                  e.headerName ? { provide: up, useValue: e.headerName } : [],
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({
              providers: [
                dp,
                { provide: hE, useExisting: dp, multi: !0 },
                { provide: pE, useClass: wV },
                { provide: cp, useValue: "XSRF-TOKEN" },
                { provide: up, useValue: "X-XSRF-TOKEN" },
              ],
            })),
            n
          );
        })(),
        MV = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({
              providers: [
                ei,
                { provide: iE, useClass: EV },
                fE,
                { provide: sE, useExisting: fE },
              ],
              imports: [
                SV.withOptions({
                  cookieName: "XSRF-TOKEN",
                  headerName: "X-XSRF-TOKEN",
                }),
              ],
            })),
            n
          );
        })();
      function Wo(n) {
        return null != n && "false" != `${n}`;
      }
      function gE(n) {
        return Array.isArray(n) ? n : [n];
      }
      function He(n) {
        return null == n ? "" : "string" == typeof n ? n : `${n}px`;
      }
      function gs(n) {
        return n instanceof Ie ? n.nativeElement : n;
      }
      function mE(n, t, e, r) {
        return (
          ur(e) && ((r = e), (e = void 0)),
          r
            ? mE(n, t, e).pipe(U((i) => (mi(i) ? r(...i) : r(i))))
            : new ye((i) => {
                _E(
                  n,
                  t,
                  function s(o) {
                    i.next(
                      arguments.length > 1
                        ? Array.prototype.slice.call(arguments)
                        : o,
                    );
                  },
                  i,
                  e,
                );
              })
        );
      }
      function _E(n, t, e, r, i) {
        let s;
        if (
          (function RV(n) {
            return (
              n &&
              "function" == typeof n.addEventListener &&
              "function" == typeof n.removeEventListener
            );
          })(n)
        ) {
          const o = n;
          n.addEventListener(t, e, i),
            (s = () => o.removeEventListener(t, e, i));
        } else if (
          (function IV(n) {
            return n && "function" == typeof n.on && "function" == typeof n.off;
          })(n)
        ) {
          const o = n;
          n.on(t, e), (s = () => o.off(t, e));
        } else if (
          (function TV(n) {
            return (
              n &&
              "function" == typeof n.addListener &&
              "function" == typeof n.removeListener
            );
          })(n)
        ) {
          const o = n;
          n.addListener(t, e), (s = () => o.removeListener(t, e));
        } else {
          if (!n || !n.length) throw new TypeError("Invalid event target");
          for (let o = 0, a = n.length; o < a; o++) _E(n[o], t, e, r, i);
        }
        r.add(s);
      }
      class xV extends ue {
        constructor(t, e) {
          super();
        }
        schedule(t, e = 0) {
          return this;
        }
      }
      class Ec extends xV {
        constructor(t, e) {
          super(t, e),
            (this.scheduler = t),
            (this.work = e),
            (this.pending = !1);
        }
        schedule(t, e = 0) {
          if (this.closed) return this;
          this.state = t;
          const r = this.id,
            i = this.scheduler;
          return (
            null != r && (this.id = this.recycleAsyncId(i, r, e)),
            (this.pending = !0),
            (this.delay = e),
            (this.id = this.id || this.requestAsyncId(i, this.id, e)),
            this
          );
        }
        requestAsyncId(t, e, r = 0) {
          return setInterval(t.flush.bind(t, this), r);
        }
        recycleAsyncId(t, e, r = 0) {
          if (null !== r && this.delay === r && !1 === this.pending) return e;
          clearInterval(e);
        }
        execute(t, e) {
          if (this.closed) return new Error("executing a cancelled action");
          this.pending = !1;
          const r = this._execute(t, e);
          if (r) return r;
          !1 === this.pending &&
            null != this.id &&
            (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
        }
        _execute(t, e) {
          let i,
            r = !1;
          try {
            this.work(t);
          } catch (s) {
            (r = !0), (i = (!!s && s) || new Error(s));
          }
          if (r) return this.unsubscribe(), i;
        }
        _unsubscribe() {
          const t = this.id,
            e = this.scheduler,
            r = e.actions,
            i = r.indexOf(this);
          (this.work = null),
            (this.state = null),
            (this.pending = !1),
            (this.scheduler = null),
            -1 !== i && r.splice(i, 1),
            null != t && (this.id = this.recycleAsyncId(e, t, null)),
            (this.delay = null);
        }
      }
      let yE = (() => {
        class n {
          constructor(e, r = n.now) {
            (this.SchedulerAction = e), (this.now = r);
          }
          schedule(e, r = 0, i) {
            return new this.SchedulerAction(this, e).schedule(i, r);
          }
        }
        return (n.now = () => Date.now()), n;
      })();
      class Cn extends yE {
        constructor(t, e = yE.now) {
          super(t, () =>
            Cn.delegate && Cn.delegate !== this ? Cn.delegate.now() : e(),
          ),
            (this.actions = []),
            (this.active = !1),
            (this.scheduled = void 0);
        }
        schedule(t, e = 0, r) {
          return Cn.delegate && Cn.delegate !== this
            ? Cn.delegate.schedule(t, e, r)
            : super.schedule(t, e, r);
        }
        flush(t) {
          const { actions: e } = this;
          if (this.active) return void e.push(t);
          let r;
          this.active = !0;
          do {
            if ((r = t.execute(t.state, t.delay))) break;
          } while ((t = e.shift()));
          if (((this.active = !1), r)) {
            for (; (t = e.shift()); ) t.unsubscribe();
            throw r;
          }
        }
      }
      new (class kV extends Cn {
        flush(t) {
          (this.active = !0), (this.scheduled = void 0);
          const { actions: e } = this;
          let r,
            i = -1,
            s = e.length;
          t = t || e.shift();
          do {
            if ((r = t.execute(t.state, t.delay))) break;
          } while (++i < s && (t = e.shift()));
          if (((this.active = !1), r)) {
            for (; ++i < s && (t = e.shift()); ) t.unsubscribe();
            throw r;
          }
        }
      })(
        class OV extends Ec {
          constructor(t, e) {
            super(t, e), (this.scheduler = t), (this.work = e);
          }
          requestAsyncId(t, e, r = 0) {
            return null !== r && r > 0
              ? super.requestAsyncId(t, e, r)
              : (t.actions.push(this),
                t.scheduled ||
                  (t.scheduled = requestAnimationFrame(() => t.flush(null))));
          }
          recycleAsyncId(t, e, r = 0) {
            if ((null !== r && r > 0) || (null === r && this.delay > 0))
              return super.recycleAsyncId(t, e, r);
            0 === t.actions.length &&
              (cancelAnimationFrame(e), (t.scheduled = void 0));
          }
        },
      );
      let PV = 1;
      const NV = Promise.resolve(),
        Sc = {};
      function vE(n) {
        return n in Sc && (delete Sc[n], !0);
      }
      const bE = {
          setImmediate(n) {
            const t = PV++;
            return (Sc[t] = !0), NV.then(() => vE(t) && n()), t;
          },
          clearImmediate(n) {
            vE(n);
          },
        },
        hp = new (class VV extends Cn {
          flush(t) {
            (this.active = !0), (this.scheduled = void 0);
            const { actions: e } = this;
            let r,
              i = -1,
              s = e.length;
            t = t || e.shift();
            do {
              if ((r = t.execute(t.state, t.delay))) break;
            } while (++i < s && (t = e.shift()));
            if (((this.active = !1), r)) {
              for (; ++i < s && (t = e.shift()); ) t.unsubscribe();
              throw r;
            }
          }
        })(
          class LV extends Ec {
            constructor(t, e) {
              super(t, e), (this.scheduler = t), (this.work = e);
            }
            requestAsyncId(t, e, r = 0) {
              return null !== r && r > 0
                ? super.requestAsyncId(t, e, r)
                : (t.actions.push(this),
                  t.scheduled ||
                    (t.scheduled = bE.setImmediate(t.flush.bind(t, null))));
            }
            recycleAsyncId(t, e, r = 0) {
              if ((null !== r && r > 0) || (null === r && this.delay > 0))
                return super.recycleAsyncId(t, e, r);
              0 === t.actions.length &&
                (bE.clearImmediate(e), (t.scheduled = void 0));
            }
          },
        ),
        Mc = new Cn(Ec);
      class jV {
        constructor(t) {
          this.durationSelector = t;
        }
        call(t, e) {
          return e.subscribe(new UV(t, this.durationSelector));
        }
      }
      class UV extends Fs {
        constructor(t, e) {
          super(t), (this.durationSelector = e), (this.hasValue = !1);
        }
        _next(t) {
          if (((this.value = t), (this.hasValue = !0), !this.throttled)) {
            let e;
            try {
              const { durationSelector: i } = this;
              e = i(t);
            } catch (i) {
              return this.destination.error(i);
            }
            const r = Ps(e, new ks(this));
            !r || r.closed
              ? this.clearThrottle()
              : this.add((this.throttled = r));
          }
        }
        clearThrottle() {
          const { value: t, hasValue: e, throttled: r } = this;
          r && (this.remove(r), (this.throttled = void 0), r.unsubscribe()),
            e &&
              ((this.value = void 0),
              (this.hasValue = !1),
              this.destination.next(t));
        }
        notifyNext() {
          this.clearThrottle();
        }
        notifyComplete() {
          this.clearThrottle();
        }
      }
      function CE(n) {
        return !mi(n) && n - parseFloat(n) + 1 >= 0;
      }
      function $V(n) {
        const { index: t, period: e, subscriber: r } = n;
        if ((r.next(t), !r.closed)) {
          if (-1 === e) return r.complete();
          (n.index = t + 1), this.schedule(n, e);
        }
      }
      function DE(n, t = Mc) {
        return (function BV(n) {
          return function (e) {
            return e.lift(new jV(n));
          };
        })(() =>
          (function HV(n = 0, t, e) {
            let r = -1;
            return (
              CE(t) ? (r = Number(t) < 1 ? 1 : Number(t)) : yi(t) && (e = t),
              yi(e) || (e = Mc),
              new ye((i) => {
                const s = CE(n) ? n : +n - e.now();
                return e.schedule($V, s, {
                  index: 0,
                  period: r,
                  subscriber: i,
                });
              })
            );
          })(n, t),
        );
      }
      let fp;
      try {
        fp = typeof Intl < "u" && Intl.v8BreakIterator;
      } catch {
        fp = !1;
      }
      let qo,
        ti,
        pp,
        Nn = (() => {
          class n {
            constructor(e) {
              (this._platformId = e),
                (this.isBrowser = this._platformId
                  ? (function b1(n) {
                      return n === ED;
                    })(this._platformId)
                  : "object" == typeof document && !!document),
                (this.EDGE =
                  this.isBrowser && /(edge)/i.test(navigator.userAgent)),
                (this.TRIDENT =
                  this.isBrowser &&
                  /(msie|trident)/i.test(navigator.userAgent)),
                (this.BLINK =
                  this.isBrowser &&
                  !(!window.chrome && !fp) &&
                  typeof CSS < "u" &&
                  !this.EDGE &&
                  !this.TRIDENT),
                (this.WEBKIT =
                  this.isBrowser &&
                  /AppleWebKit/i.test(navigator.userAgent) &&
                  !this.BLINK &&
                  !this.EDGE &&
                  !this.TRIDENT),
                (this.IOS =
                  this.isBrowser &&
                  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                  !("MSStream" in window)),
                (this.FIREFOX =
                  this.isBrowser &&
                  /(firefox|minefield)/i.test(navigator.userAgent)),
                (this.ANDROID =
                  this.isBrowser &&
                  /android/i.test(navigator.userAgent) &&
                  !this.TRIDENT),
                (this.SAFARI =
                  this.isBrowser &&
                  /safari/i.test(navigator.userAgent) &&
                  this.WEBKIT);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Vl));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        wE = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })();
      function Ac(n) {
        return (function zV() {
          if (null == qo && typeof window < "u")
            try {
              window.addEventListener(
                "test",
                null,
                Object.defineProperty({}, "passive", { get: () => (qo = !0) }),
              );
            } finally {
              qo = qo || !1;
            }
          return qo;
        })()
          ? n
          : !!n.capture;
      }
      function GV() {
        if (null == ti) {
          if (
            "object" != typeof document ||
            !document ||
            "function" != typeof Element ||
            !Element
          )
            return (ti = !1), ti;
          if ("scrollBehavior" in document.documentElement.style) ti = !0;
          else {
            const n = Element.prototype.scrollTo;
            ti = !!n && !/\{\s*\[native code\]\s*\}/.test(n.toString());
          }
        }
        return ti;
      }
      function gp() {
        let n =
          typeof document < "u" && document ? document.activeElement : null;
        for (; n && n.shadowRoot; ) {
          const t = n.shadowRoot.activeElement;
          if (t === n) break;
          n = t;
        }
        return n;
      }
      function ni(n) {
        return n.composedPath ? n.composedPath()[0] : n.target;
      }
      function mp() {
        return (
          (typeof __karma__ < "u" && !!__karma__) ||
          (typeof jasmine < "u" && !!jasmine) ||
          (typeof jest < "u" && !!jest) ||
          (typeof Mocha < "u" && !!Mocha)
        );
      }
      const KV = new w("cdk-dir-doc", {
        providedIn: "root",
        factory: function YV() {
          return te(Y);
        },
      });
      let Ic = (() => {
          class n {
            constructor(e) {
              if (((this.value = "ltr"), (this.change = new ae()), e)) {
                const i = e.documentElement ? e.documentElement.dir : null,
                  s = (e.body ? e.body.dir : null) || i;
                this.value = "ltr" === s || "rtl" === s ? s : "ltr";
              }
            }
            ngOnDestroy() {
              this.change.complete();
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(KV, 8));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        Ko = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })(),
        QV = (() => {
          class n {
            constructor(e, r, i) {
              (this._ngZone = e),
                (this._platform = r),
                (this._scrolled = new de()),
                (this._globalSubscription = null),
                (this._scrolledCount = 0),
                (this.scrollContainers = new Map()),
                (this._document = i);
            }
            register(e) {
              this.scrollContainers.has(e) ||
                this.scrollContainers.set(
                  e,
                  e.elementScrolled().subscribe(() => this._scrolled.next(e)),
                );
            }
            deregister(e) {
              const r = this.scrollContainers.get(e);
              r && (r.unsubscribe(), this.scrollContainers.delete(e));
            }
            scrolled(e = 20) {
              return this._platform.isBrowser
                ? new ye((r) => {
                    this._globalSubscription || this._addGlobalListener();
                    const i =
                      e > 0
                        ? this._scrolled.pipe(DE(e)).subscribe(r)
                        : this._scrolled.subscribe(r);
                    return (
                      this._scrolledCount++,
                      () => {
                        i.unsubscribe(),
                          this._scrolledCount--,
                          this._scrolledCount || this._removeGlobalListener();
                      }
                    );
                  })
                : k();
            }
            ngOnDestroy() {
              this._removeGlobalListener(),
                this.scrollContainers.forEach((e, r) => this.deregister(r)),
                this._scrolled.complete();
            }
            ancestorScrolled(e, r) {
              const i = this.getAncestorScrollContainers(e);
              return this.scrolled(r).pipe(Ze((s) => !s || i.indexOf(s) > -1));
            }
            getAncestorScrollContainers(e) {
              const r = [];
              return (
                this.scrollContainers.forEach((i, s) => {
                  this._scrollableContainsElement(s, e) && r.push(s);
                }),
                r
              );
            }
            _getWindow() {
              return this._document.defaultView || window;
            }
            _scrollableContainsElement(e, r) {
              let i = gs(r),
                s = e.getElementRef().nativeElement;
              do {
                if (i == s) return !0;
              } while ((i = i.parentElement));
              return !1;
            }
            _addGlobalListener() {
              this._globalSubscription = this._ngZone.runOutsideAngular(() =>
                mE(this._getWindow().document, "scroll").subscribe(() =>
                  this._scrolled.next(),
                ),
              );
            }
            _removeGlobalListener() {
              this._globalSubscription &&
                (this._globalSubscription.unsubscribe(),
                (this._globalSubscription = null));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(le), m(Nn), m(Y, 8));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        SE = (() => {
          class n {
            constructor(e, r, i) {
              (this._platform = e),
                (this._change = new de()),
                (this._changeListener = (s) => {
                  this._change.next(s);
                }),
                (this._document = i),
                r.runOutsideAngular(() => {
                  if (e.isBrowser) {
                    const s = this._getWindow();
                    s.addEventListener("resize", this._changeListener),
                      s.addEventListener(
                        "orientationchange",
                        this._changeListener,
                      );
                  }
                  this.change().subscribe(() => (this._viewportSize = null));
                });
            }
            ngOnDestroy() {
              if (this._platform.isBrowser) {
                const e = this._getWindow();
                e.removeEventListener("resize", this._changeListener),
                  e.removeEventListener(
                    "orientationchange",
                    this._changeListener,
                  );
              }
              this._change.complete();
            }
            getViewportSize() {
              this._viewportSize || this._updateViewportSize();
              const e = {
                width: this._viewportSize.width,
                height: this._viewportSize.height,
              };
              return this._platform.isBrowser || (this._viewportSize = null), e;
            }
            getViewportRect() {
              const e = this.getViewportScrollPosition(),
                { width: r, height: i } = this.getViewportSize();
              return {
                top: e.top,
                left: e.left,
                bottom: e.top + i,
                right: e.left + r,
                height: i,
                width: r,
              };
            }
            getViewportScrollPosition() {
              if (!this._platform.isBrowser) return { top: 0, left: 0 };
              const e = this._document,
                r = this._getWindow(),
                i = e.documentElement,
                s = i.getBoundingClientRect();
              return {
                top:
                  -s.top || e.body.scrollTop || r.scrollY || i.scrollTop || 0,
                left:
                  -s.left ||
                  e.body.scrollLeft ||
                  r.scrollX ||
                  i.scrollLeft ||
                  0,
              };
            }
            change(e = 20) {
              return e > 0 ? this._change.pipe(DE(e)) : this._change;
            }
            _getWindow() {
              return this._document.defaultView || window;
            }
            _updateViewportSize() {
              const e = this._getWindow();
              this._viewportSize = this._platform.isBrowser
                ? { width: e.innerWidth, height: e.innerHeight }
                : { width: 0, height: 0 };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Nn), m(le), m(Y, 8));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        _p = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })(),
        ME = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ imports: [[Ko, wE, _p], Ko, _p] })),
            n
          );
        })();
      class yp {
        attach(t) {
          return (this._attachedHost = t), t.attach(this);
        }
        detach() {
          let t = this._attachedHost;
          null != t && ((this._attachedHost = null), t.detach());
        }
        get isAttached() {
          return null != this._attachedHost;
        }
        setAttachedHost(t) {
          this._attachedHost = t;
        }
      }
      class vp extends yp {
        constructor(t, e, r, i) {
          super(),
            (this.component = t),
            (this.viewContainerRef = e),
            (this.injector = r),
            (this.componentFactoryResolver = i);
        }
      }
      class bp extends yp {
        constructor(t, e, r) {
          super(),
            (this.templateRef = t),
            (this.viewContainerRef = e),
            (this.context = r);
        }
        get origin() {
          return this.templateRef.elementRef;
        }
        attach(t, e = this.context) {
          return (this.context = e), super.attach(t);
        }
        detach() {
          return (this.context = void 0), super.detach();
        }
      }
      class JV extends yp {
        constructor(t) {
          super(), (this.element = t instanceof Ie ? t.nativeElement : t);
        }
      }
      class Cp {
        constructor() {
          (this._isDisposed = !1), (this.attachDomPortal = null);
        }
        hasAttached() {
          return !!this._attachedPortal;
        }
        attach(t) {
          return t instanceof vp
            ? ((this._attachedPortal = t), this.attachComponentPortal(t))
            : t instanceof bp
              ? ((this._attachedPortal = t), this.attachTemplatePortal(t))
              : this.attachDomPortal && t instanceof JV
                ? ((this._attachedPortal = t), this.attachDomPortal(t))
                : void 0;
        }
        detach() {
          this._attachedPortal &&
            (this._attachedPortal.setAttachedHost(null),
            (this._attachedPortal = null)),
            this._invokeDisposeFn();
        }
        dispose() {
          this.hasAttached() && this.detach(),
            this._invokeDisposeFn(),
            (this._isDisposed = !0);
        }
        setDisposeFn(t) {
          this._disposeFn = t;
        }
        _invokeDisposeFn() {
          this._disposeFn && (this._disposeFn(), (this._disposeFn = null));
        }
      }
      class eB extends Cp {
        constructor(t, e, r, i, s) {
          super(),
            (this.outletElement = t),
            (this._componentFactoryResolver = e),
            (this._appRef = r),
            (this._defaultInjector = i),
            (this.attachDomPortal = (o) => {
              const a = o.element,
                l = this._document.createComment("dom-portal");
              a.parentNode.insertBefore(l, a),
                this.outletElement.appendChild(a),
                (this._attachedPortal = o),
                super.setDisposeFn(() => {
                  l.parentNode && l.parentNode.replaceChild(a, l);
                });
            }),
            (this._document = s);
        }
        attachComponentPortal(t) {
          const r = (
            t.componentFactoryResolver || this._componentFactoryResolver
          ).resolveComponentFactory(t.component);
          let i;
          return (
            t.viewContainerRef
              ? ((i = t.viewContainerRef.createComponent(
                  r,
                  t.viewContainerRef.length,
                  t.injector || t.viewContainerRef.injector,
                )),
                this.setDisposeFn(() => i.destroy()))
              : ((i = r.create(t.injector || this._defaultInjector)),
                this._appRef.attachView(i.hostView),
                this.setDisposeFn(() => {
                  this._appRef.detachView(i.hostView), i.destroy();
                })),
            this.outletElement.appendChild(this._getComponentRootNode(i)),
            (this._attachedPortal = t),
            i
          );
        }
        attachTemplatePortal(t) {
          let e = t.viewContainerRef,
            r = e.createEmbeddedView(t.templateRef, t.context);
          return (
            r.rootNodes.forEach((i) => this.outletElement.appendChild(i)),
            r.detectChanges(),
            this.setDisposeFn(() => {
              let i = e.indexOf(r);
              -1 !== i && e.remove(i);
            }),
            (this._attachedPortal = t),
            r
          );
        }
        dispose() {
          super.dispose(), this.outletElement.remove();
        }
        _getComponentRootNode(t) {
          return t.hostView.rootNodes[0];
        }
      }
      let AE = (() => {
          class n extends Cp {
            constructor(e, r, i) {
              super(),
                (this._componentFactoryResolver = e),
                (this._viewContainerRef = r),
                (this._isInitialized = !1),
                (this.attached = new ae()),
                (this.attachDomPortal = (s) => {
                  const o = s.element,
                    a = this._document.createComment("dom-portal");
                  s.setAttachedHost(this),
                    o.parentNode.insertBefore(a, o),
                    this._getRootNode().appendChild(o),
                    (this._attachedPortal = s),
                    super.setDisposeFn(() => {
                      a.parentNode && a.parentNode.replaceChild(o, a);
                    });
                }),
                (this._document = i);
            }
            get portal() {
              return this._attachedPortal;
            }
            set portal(e) {
              (this.hasAttached() && !e && !this._isInitialized) ||
                (this.hasAttached() && super.detach(),
                e && super.attach(e),
                (this._attachedPortal = e));
            }
            get attachedRef() {
              return this._attachedRef;
            }
            ngOnInit() {
              this._isInitialized = !0;
            }
            ngOnDestroy() {
              super.dispose(),
                (this._attachedPortal = null),
                (this._attachedRef = null);
            }
            attachComponentPortal(e) {
              e.setAttachedHost(this);
              const r =
                  null != e.viewContainerRef
                    ? e.viewContainerRef
                    : this._viewContainerRef,
                s = (
                  e.componentFactoryResolver || this._componentFactoryResolver
                ).resolveComponentFactory(e.component),
                o = r.createComponent(s, r.length, e.injector || r.injector);
              return (
                r !== this._viewContainerRef &&
                  this._getRootNode().appendChild(o.hostView.rootNodes[0]),
                super.setDisposeFn(() => o.destroy()),
                (this._attachedPortal = e),
                (this._attachedRef = o),
                this.attached.emit(o),
                o
              );
            }
            attachTemplatePortal(e) {
              e.setAttachedHost(this);
              const r = this._viewContainerRef.createEmbeddedView(
                e.templateRef,
                e.context,
              );
              return (
                super.setDisposeFn(() => this._viewContainerRef.clear()),
                (this._attachedPortal = e),
                (this._attachedRef = r),
                this.attached.emit(r),
                r
              );
            }
            _getRootNode() {
              const e = this._viewContainerRef.element.nativeElement;
              return e.nodeType === e.ELEMENT_NODE ? e : e.parentNode;
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Gr), _(Ut), _(Y));
            }),
            (n.ɵdir = F({
              type: n,
              selectors: [["", "cdkPortalOutlet", ""]],
              inputs: { portal: ["cdkPortalOutlet", "portal"] },
              outputs: { attached: "attached" },
              exportAs: ["cdkPortalOutlet"],
              features: [ne],
            })),
            n
          );
        })(),
        TE = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })();
      const IE = (() => {
          function n() {
            return (
              Error.call(this),
              (this.message = "argument out of range"),
              (this.name = "ArgumentOutOfRangeError"),
              this
            );
          }
          return (n.prototype = Object.create(Error.prototype)), n;
        })(),
        _s = new ye((n) => n.complete());
      function Rc(n) {
        return n
          ? (function tB(n) {
              return new ye((t) => n.schedule(() => t.complete()));
            })(n)
          : _s;
      }
      function Tt(n) {
        return (t) => (0 === n ? Rc() : t.lift(new nB(n)));
      }
      class nB {
        constructor(t) {
          if (((this.total = t), this.total < 0)) throw new IE();
        }
        call(t, e) {
          return e.subscribe(new rB(t, this.total));
        }
      }
      class rB extends ge {
        constructor(t, e) {
          super(t), (this.total = e), (this.count = 0);
        }
        _next(t) {
          const e = this.total,
            r = ++this.count;
          r <= e &&
            (this.destination.next(t),
            r === e && (this.destination.complete(), this.unsubscribe()));
        }
      }
      function xc(n) {
        return (t) => t.lift(new iB(n));
      }
      class iB {
        constructor(t) {
          this.notifier = t;
        }
        call(t, e) {
          const r = new sB(t),
            i = Ps(this.notifier, new ks(r));
          return i && !r.seenValue ? (r.add(i), e.subscribe(r)) : r;
        }
      }
      class sB extends Fs {
        constructor(t) {
          super(t), (this.seenValue = !1);
        }
        notifyNext() {
          (this.seenValue = !0), this.complete();
        }
        notifyComplete() {}
      }
      const RE = GV();
      class oB {
        constructor(t, e) {
          (this._viewportRuler = t),
            (this._previousHTMLStyles = { top: "", left: "" }),
            (this._isEnabled = !1),
            (this._document = e);
        }
        attach() {}
        enable() {
          if (this._canBeEnabled()) {
            const t = this._document.documentElement;
            (this._previousScrollPosition =
              this._viewportRuler.getViewportScrollPosition()),
              (this._previousHTMLStyles.left = t.style.left || ""),
              (this._previousHTMLStyles.top = t.style.top || ""),
              (t.style.left = He(-this._previousScrollPosition.left)),
              (t.style.top = He(-this._previousScrollPosition.top)),
              t.classList.add("cdk-global-scrollblock"),
              (this._isEnabled = !0);
          }
        }
        disable() {
          if (this._isEnabled) {
            const t = this._document.documentElement,
              r = t.style,
              i = this._document.body.style,
              s = r.scrollBehavior || "",
              o = i.scrollBehavior || "";
            (this._isEnabled = !1),
              (r.left = this._previousHTMLStyles.left),
              (r.top = this._previousHTMLStyles.top),
              t.classList.remove("cdk-global-scrollblock"),
              RE && (r.scrollBehavior = i.scrollBehavior = "auto"),
              window.scroll(
                this._previousScrollPosition.left,
                this._previousScrollPosition.top,
              ),
              RE && ((r.scrollBehavior = s), (i.scrollBehavior = o));
          }
        }
        _canBeEnabled() {
          if (
            this._document.documentElement.classList.contains(
              "cdk-global-scrollblock",
            ) ||
            this._isEnabled
          )
            return !1;
          const e = this._document.body,
            r = this._viewportRuler.getViewportSize();
          return e.scrollHeight > r.height || e.scrollWidth > r.width;
        }
      }
      class aB {
        constructor(t, e, r, i) {
          (this._scrollDispatcher = t),
            (this._ngZone = e),
            (this._viewportRuler = r),
            (this._config = i),
            (this._scrollSubscription = null),
            (this._detach = () => {
              this.disable(),
                this._overlayRef.hasAttached() &&
                  this._ngZone.run(() => this._overlayRef.detach());
            });
        }
        attach(t) {
          this._overlayRef = t;
        }
        enable() {
          if (this._scrollSubscription) return;
          const t = this._scrollDispatcher.scrolled(0);
          this._config && this._config.threshold && this._config.threshold > 1
            ? ((this._initialScrollPosition =
                this._viewportRuler.getViewportScrollPosition().top),
              (this._scrollSubscription = t.subscribe(() => {
                const e = this._viewportRuler.getViewportScrollPosition().top;
                Math.abs(e - this._initialScrollPosition) >
                this._config.threshold
                  ? this._detach()
                  : this._overlayRef.updatePosition();
              })))
            : (this._scrollSubscription = t.subscribe(this._detach));
        }
        disable() {
          this._scrollSubscription &&
            (this._scrollSubscription.unsubscribe(),
            (this._scrollSubscription = null));
        }
        detach() {
          this.disable(), (this._overlayRef = null);
        }
      }
      class xE {
        enable() {}
        disable() {}
        attach() {}
      }
      function Dp(n, t) {
        return t.some(
          (e) =>
            n.bottom < e.top ||
            n.top > e.bottom ||
            n.right < e.left ||
            n.left > e.right,
        );
      }
      function OE(n, t) {
        return t.some(
          (e) =>
            n.top < e.top ||
            n.bottom > e.bottom ||
            n.left < e.left ||
            n.right > e.right,
        );
      }
      class lB {
        constructor(t, e, r, i) {
          (this._scrollDispatcher = t),
            (this._viewportRuler = e),
            (this._ngZone = r),
            (this._config = i),
            (this._scrollSubscription = null);
        }
        attach(t) {
          this._overlayRef = t;
        }
        enable() {
          this._scrollSubscription ||
            (this._scrollSubscription = this._scrollDispatcher
              .scrolled(this._config ? this._config.scrollThrottle : 0)
              .subscribe(() => {
                if (
                  (this._overlayRef.updatePosition(),
                  this._config && this._config.autoClose)
                ) {
                  const e =
                      this._overlayRef.overlayElement.getBoundingClientRect(),
                    { width: r, height: i } =
                      this._viewportRuler.getViewportSize();
                  Dp(e, [
                    {
                      width: r,
                      height: i,
                      bottom: i,
                      right: r,
                      top: 0,
                      left: 0,
                    },
                  ]) &&
                    (this.disable(),
                    this._ngZone.run(() => this._overlayRef.detach()));
                }
              }));
        }
        disable() {
          this._scrollSubscription &&
            (this._scrollSubscription.unsubscribe(),
            (this._scrollSubscription = null));
        }
        detach() {
          this.disable(), (this._overlayRef = null);
        }
      }
      let cB = (() => {
        class n {
          constructor(e, r, i, s) {
            (this._scrollDispatcher = e),
              (this._viewportRuler = r),
              (this._ngZone = i),
              (this.noop = () => new xE()),
              (this.close = (o) =>
                new aB(
                  this._scrollDispatcher,
                  this._ngZone,
                  this._viewportRuler,
                  o,
                )),
              (this.block = () => new oB(this._viewportRuler, this._document)),
              (this.reposition = (o) =>
                new lB(
                  this._scrollDispatcher,
                  this._viewportRuler,
                  this._ngZone,
                  o,
                )),
              (this._document = s);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(QV), m(SE), m(le), m(Y));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      class wp {
        constructor(t) {
          if (
            ((this.scrollStrategy = new xE()),
            (this.panelClass = ""),
            (this.hasBackdrop = !1),
            (this.backdropClass = "cdk-overlay-dark-backdrop"),
            (this.disposeOnNavigation = !1),
            t)
          ) {
            const e = Object.keys(t);
            for (const r of e) void 0 !== t[r] && (this[r] = t[r]);
          }
        }
      }
      class uB {
        constructor(t, e) {
          (this.connectionPair = t), (this.scrollableViewProperties = e);
        }
      }
      let kE = (() => {
          class n {
            constructor(e) {
              (this._attachedOverlays = []), (this._document = e);
            }
            ngOnDestroy() {
              this.detach();
            }
            add(e) {
              this.remove(e), this._attachedOverlays.push(e);
            }
            remove(e) {
              const r = this._attachedOverlays.indexOf(e);
              r > -1 && this._attachedOverlays.splice(r, 1),
                0 === this._attachedOverlays.length && this.detach();
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        dB = (() => {
          class n extends kE {
            constructor(e) {
              super(e),
                (this._keydownListener = (r) => {
                  const i = this._attachedOverlays;
                  for (let s = i.length - 1; s > -1; s--)
                    if (i[s]._keydownEvents.observers.length > 0) {
                      i[s]._keydownEvents.next(r);
                      break;
                    }
                });
            }
            add(e) {
              super.add(e),
                this._isAttached ||
                  (this._document.body.addEventListener(
                    "keydown",
                    this._keydownListener,
                  ),
                  (this._isAttached = !0));
            }
            detach() {
              this._isAttached &&
                (this._document.body.removeEventListener(
                  "keydown",
                  this._keydownListener,
                ),
                (this._isAttached = !1));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        hB = (() => {
          class n extends kE {
            constructor(e, r) {
              super(e),
                (this._platform = r),
                (this._cursorStyleIsSet = !1),
                (this._pointerDownListener = (i) => {
                  this._pointerDownEventTarget = ni(i);
                }),
                (this._clickListener = (i) => {
                  const s = ni(i),
                    o =
                      "click" === i.type && this._pointerDownEventTarget
                        ? this._pointerDownEventTarget
                        : s;
                  this._pointerDownEventTarget = null;
                  const a = this._attachedOverlays.slice();
                  for (let l = a.length - 1; l > -1; l--) {
                    const c = a[l];
                    if (
                      !(c._outsidePointerEvents.observers.length < 1) &&
                      c.hasAttached()
                    ) {
                      if (
                        c.overlayElement.contains(s) ||
                        c.overlayElement.contains(o)
                      )
                        break;
                      c._outsidePointerEvents.next(i);
                    }
                  }
                });
            }
            add(e) {
              if ((super.add(e), !this._isAttached)) {
                const r = this._document.body;
                r.addEventListener(
                  "pointerdown",
                  this._pointerDownListener,
                  !0,
                ),
                  r.addEventListener("click", this._clickListener, !0),
                  r.addEventListener("auxclick", this._clickListener, !0),
                  r.addEventListener("contextmenu", this._clickListener, !0),
                  this._platform.IOS &&
                    !this._cursorStyleIsSet &&
                    ((this._cursorOriginalValue = r.style.cursor),
                    (r.style.cursor = "pointer"),
                    (this._cursorStyleIsSet = !0)),
                  (this._isAttached = !0);
              }
            }
            detach() {
              if (this._isAttached) {
                const e = this._document.body;
                e.removeEventListener(
                  "pointerdown",
                  this._pointerDownListener,
                  !0,
                ),
                  e.removeEventListener("click", this._clickListener, !0),
                  e.removeEventListener("auxclick", this._clickListener, !0),
                  e.removeEventListener("contextmenu", this._clickListener, !0),
                  this._platform.IOS &&
                    this._cursorStyleIsSet &&
                    ((e.style.cursor = this._cursorOriginalValue),
                    (this._cursorStyleIsSet = !1)),
                  (this._isAttached = !1);
              }
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y), m(Nn));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        Ep = (() => {
          class n {
            constructor(e, r) {
              (this._platform = r), (this._document = e);
            }
            ngOnDestroy() {
              this._containerElement?.remove();
            }
            getContainerElement() {
              return (
                this._containerElement || this._createContainer(),
                this._containerElement
              );
            }
            _createContainer() {
              const e = "cdk-overlay-container";
              if (this._platform.isBrowser || mp()) {
                const i = this._document.querySelectorAll(
                  `.${e}[platform="server"], .${e}[platform="test"]`,
                );
                for (let s = 0; s < i.length; s++) i[s].remove();
              }
              const r = this._document.createElement("div");
              r.classList.add(e),
                mp()
                  ? r.setAttribute("platform", "test")
                  : this._platform.isBrowser ||
                    r.setAttribute("platform", "server"),
                this._document.body.appendChild(r),
                (this._containerElement = r);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(Y), m(Nn));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })();
      class fB {
        constructor(t, e, r, i, s, o, a, l, c) {
          (this._portalOutlet = t),
            (this._host = e),
            (this._pane = r),
            (this._config = i),
            (this._ngZone = s),
            (this._keyboardDispatcher = o),
            (this._document = a),
            (this._location = l),
            (this._outsideClickDispatcher = c),
            (this._backdropElement = null),
            (this._backdropClick = new de()),
            (this._attachments = new de()),
            (this._detachments = new de()),
            (this._locationChanges = ue.EMPTY),
            (this._backdropClickHandler = (u) => this._backdropClick.next(u)),
            (this._keydownEvents = new de()),
            (this._outsidePointerEvents = new de()),
            i.scrollStrategy &&
              ((this._scrollStrategy = i.scrollStrategy),
              this._scrollStrategy.attach(this)),
            (this._positionStrategy = i.positionStrategy);
        }
        get overlayElement() {
          return this._pane;
        }
        get backdropElement() {
          return this._backdropElement;
        }
        get hostElement() {
          return this._host;
        }
        attach(t) {
          let e = this._portalOutlet.attach(t);
          return (
            !this._host.parentElement &&
              this._previousHostParent &&
              this._previousHostParent.appendChild(this._host),
            this._positionStrategy && this._positionStrategy.attach(this),
            this._updateStackingOrder(),
            this._updateElementSize(),
            this._updateElementDirection(),
            this._scrollStrategy && this._scrollStrategy.enable(),
            this._ngZone.onStable.pipe(Tt(1)).subscribe(() => {
              this.hasAttached() && this.updatePosition();
            }),
            this._togglePointerEvents(!0),
            this._config.hasBackdrop && this._attachBackdrop(),
            this._config.panelClass &&
              this._toggleClasses(this._pane, this._config.panelClass, !0),
            this._attachments.next(),
            this._keyboardDispatcher.add(this),
            this._config.disposeOnNavigation &&
              (this._locationChanges = this._location.subscribe(() =>
                this.dispose(),
              )),
            this._outsideClickDispatcher.add(this),
            e
          );
        }
        detach() {
          if (!this.hasAttached()) return;
          this.detachBackdrop(),
            this._togglePointerEvents(!1),
            this._positionStrategy &&
              this._positionStrategy.detach &&
              this._positionStrategy.detach(),
            this._scrollStrategy && this._scrollStrategy.disable();
          const t = this._portalOutlet.detach();
          return (
            this._detachments.next(),
            this._keyboardDispatcher.remove(this),
            this._detachContentWhenStable(),
            this._locationChanges.unsubscribe(),
            this._outsideClickDispatcher.remove(this),
            t
          );
        }
        dispose() {
          const t = this.hasAttached();
          this._positionStrategy && this._positionStrategy.dispose(),
            this._disposeScrollStrategy(),
            this._disposeBackdrop(this._backdropElement),
            this._locationChanges.unsubscribe(),
            this._keyboardDispatcher.remove(this),
            this._portalOutlet.dispose(),
            this._attachments.complete(),
            this._backdropClick.complete(),
            this._keydownEvents.complete(),
            this._outsidePointerEvents.complete(),
            this._outsideClickDispatcher.remove(this),
            this._host?.remove(),
            (this._previousHostParent = this._pane = this._host = null),
            t && this._detachments.next(),
            this._detachments.complete();
        }
        hasAttached() {
          return this._portalOutlet.hasAttached();
        }
        backdropClick() {
          return this._backdropClick;
        }
        attachments() {
          return this._attachments;
        }
        detachments() {
          return this._detachments;
        }
        keydownEvents() {
          return this._keydownEvents;
        }
        outsidePointerEvents() {
          return this._outsidePointerEvents;
        }
        getConfig() {
          return this._config;
        }
        updatePosition() {
          this._positionStrategy && this._positionStrategy.apply();
        }
        updatePositionStrategy(t) {
          t !== this._positionStrategy &&
            (this._positionStrategy && this._positionStrategy.dispose(),
            (this._positionStrategy = t),
            this.hasAttached() && (t.attach(this), this.updatePosition()));
        }
        updateSize(t) {
          (this._config = { ...this._config, ...t }), this._updateElementSize();
        }
        setDirection(t) {
          (this._config = { ...this._config, direction: t }),
            this._updateElementDirection();
        }
        addPanelClass(t) {
          this._pane && this._toggleClasses(this._pane, t, !0);
        }
        removePanelClass(t) {
          this._pane && this._toggleClasses(this._pane, t, !1);
        }
        getDirection() {
          const t = this._config.direction;
          return t ? ("string" == typeof t ? t : t.value) : "ltr";
        }
        updateScrollStrategy(t) {
          t !== this._scrollStrategy &&
            (this._disposeScrollStrategy(),
            (this._scrollStrategy = t),
            this.hasAttached() && (t.attach(this), t.enable()));
        }
        _updateElementDirection() {
          this._host.setAttribute("dir", this.getDirection());
        }
        _updateElementSize() {
          if (!this._pane) return;
          const t = this._pane.style;
          (t.width = He(this._config.width)),
            (t.height = He(this._config.height)),
            (t.minWidth = He(this._config.minWidth)),
            (t.minHeight = He(this._config.minHeight)),
            (t.maxWidth = He(this._config.maxWidth)),
            (t.maxHeight = He(this._config.maxHeight));
        }
        _togglePointerEvents(t) {
          this._pane.style.pointerEvents = t ? "" : "none";
        }
        _attachBackdrop() {
          const t = "cdk-overlay-backdrop-showing";
          (this._backdropElement = this._document.createElement("div")),
            this._backdropElement.classList.add("cdk-overlay-backdrop"),
            this._config.backdropClass &&
              this._toggleClasses(
                this._backdropElement,
                this._config.backdropClass,
                !0,
              ),
            this._host.parentElement.insertBefore(
              this._backdropElement,
              this._host,
            ),
            this._backdropElement.addEventListener(
              "click",
              this._backdropClickHandler,
            ),
            typeof requestAnimationFrame < "u"
              ? this._ngZone.runOutsideAngular(() => {
                  requestAnimationFrame(() => {
                    this._backdropElement &&
                      this._backdropElement.classList.add(t);
                  });
                })
              : this._backdropElement.classList.add(t);
        }
        _updateStackingOrder() {
          this._host.nextSibling &&
            this._host.parentNode.appendChild(this._host);
        }
        detachBackdrop() {
          const t = this._backdropElement;
          if (!t) return;
          let e;
          const r = () => {
            t &&
              (t.removeEventListener("click", this._backdropClickHandler),
              t.removeEventListener("transitionend", r),
              this._disposeBackdrop(t)),
              this._config.backdropClass &&
                this._toggleClasses(t, this._config.backdropClass, !1),
              clearTimeout(e);
          };
          t.classList.remove("cdk-overlay-backdrop-showing"),
            this._ngZone.runOutsideAngular(() => {
              t.addEventListener("transitionend", r);
            }),
            (t.style.pointerEvents = "none"),
            (e = this._ngZone.runOutsideAngular(() => setTimeout(r, 500)));
        }
        _toggleClasses(t, e, r) {
          const i = gE(e || []).filter((s) => !!s);
          i.length && (r ? t.classList.add(...i) : t.classList.remove(...i));
        }
        _detachContentWhenStable() {
          this._ngZone.runOutsideAngular(() => {
            const t = this._ngZone.onStable
              .pipe(xc(Ns(this._attachments, this._detachments)))
              .subscribe(() => {
                (!this._pane ||
                  !this._host ||
                  0 === this._pane.children.length) &&
                  (this._pane &&
                    this._config.panelClass &&
                    this._toggleClasses(
                      this._pane,
                      this._config.panelClass,
                      !1,
                    ),
                  this._host &&
                    this._host.parentElement &&
                    ((this._previousHostParent = this._host.parentElement),
                    this._host.remove()),
                  t.unsubscribe());
              });
          });
        }
        _disposeScrollStrategy() {
          const t = this._scrollStrategy;
          t && (t.disable(), t.detach && t.detach());
        }
        _disposeBackdrop(t) {
          t &&
            (t.remove(),
            this._backdropElement === t && (this._backdropElement = null));
        }
      }
      const FE = "cdk-overlay-connected-position-bounding-box",
        pB = /([A-Za-z%]+)$/;
      class gB {
        constructor(t, e, r, i, s) {
          (this._viewportRuler = e),
            (this._document = r),
            (this._platform = i),
            (this._overlayContainer = s),
            (this._lastBoundingBoxSize = { width: 0, height: 0 }),
            (this._isPushed = !1),
            (this._canPush = !0),
            (this._growAfterOpen = !1),
            (this._hasFlexibleDimensions = !0),
            (this._positionLocked = !1),
            (this._viewportMargin = 0),
            (this._scrollables = []),
            (this._preferredPositions = []),
            (this._positionChanges = new de()),
            (this._resizeSubscription = ue.EMPTY),
            (this._offsetX = 0),
            (this._offsetY = 0),
            (this._appliedPanelClasses = []),
            (this.positionChanges = this._positionChanges),
            this.setOrigin(t);
        }
        get positions() {
          return this._preferredPositions;
        }
        attach(t) {
          this._validatePositions(),
            t.hostElement.classList.add(FE),
            (this._overlayRef = t),
            (this._boundingBox = t.hostElement),
            (this._pane = t.overlayElement),
            (this._isDisposed = !1),
            (this._isInitialRender = !0),
            (this._lastPosition = null),
            this._resizeSubscription.unsubscribe(),
            (this._resizeSubscription = this._viewportRuler
              .change()
              .subscribe(() => {
                (this._isInitialRender = !0), this.apply();
              }));
        }
        apply() {
          if (this._isDisposed || !this._platform.isBrowser) return;
          if (
            !this._isInitialRender &&
            this._positionLocked &&
            this._lastPosition
          )
            return void this.reapplyLastPosition();
          this._clearPanelClasses(),
            this._resetOverlayElementStyles(),
            this._resetBoundingBoxStyles(),
            (this._viewportRect = this._getNarrowedViewportRect()),
            (this._originRect = this._getOriginRect()),
            (this._overlayRect = this._pane.getBoundingClientRect());
          const t = this._originRect,
            e = this._overlayRect,
            r = this._viewportRect,
            i = [];
          let s;
          for (let o of this._preferredPositions) {
            let a = this._getOriginPoint(t, o),
              l = this._getOverlayPoint(a, e, o),
              c = this._getOverlayFit(l, e, r, o);
            if (c.isCompletelyWithinViewport)
              return (this._isPushed = !1), void this._applyPosition(o, a);
            this._canFitWithFlexibleDimensions(c, l, r)
              ? i.push({
                  position: o,
                  origin: a,
                  overlayRect: e,
                  boundingBoxRect: this._calculateBoundingBoxRect(a, o),
                })
              : (!s || s.overlayFit.visibleArea < c.visibleArea) &&
                (s = {
                  overlayFit: c,
                  overlayPoint: l,
                  originPoint: a,
                  position: o,
                  overlayRect: e,
                });
          }
          if (i.length) {
            let o = null,
              a = -1;
            for (const l of i) {
              const c =
                l.boundingBoxRect.width *
                l.boundingBoxRect.height *
                (l.position.weight || 1);
              c > a && ((a = c), (o = l));
            }
            return (
              (this._isPushed = !1),
              void this._applyPosition(o.position, o.origin)
            );
          }
          if (this._canPush)
            return (
              (this._isPushed = !0),
              void this._applyPosition(s.position, s.originPoint)
            );
          this._applyPosition(s.position, s.originPoint);
        }
        detach() {
          this._clearPanelClasses(),
            (this._lastPosition = null),
            (this._previousPushAmount = null),
            this._resizeSubscription.unsubscribe();
        }
        dispose() {
          this._isDisposed ||
            (this._boundingBox &&
              ri(this._boundingBox.style, {
                top: "",
                left: "",
                right: "",
                bottom: "",
                height: "",
                width: "",
                alignItems: "",
                justifyContent: "",
              }),
            this._pane && this._resetOverlayElementStyles(),
            this._overlayRef &&
              this._overlayRef.hostElement.classList.remove(FE),
            this.detach(),
            this._positionChanges.complete(),
            (this._overlayRef = this._boundingBox = null),
            (this._isDisposed = !0));
        }
        reapplyLastPosition() {
          if (
            !this._isDisposed &&
            (!this._platform || this._platform.isBrowser)
          ) {
            (this._originRect = this._getOriginRect()),
              (this._overlayRect = this._pane.getBoundingClientRect()),
              (this._viewportRect = this._getNarrowedViewportRect());
            const t = this._lastPosition || this._preferredPositions[0],
              e = this._getOriginPoint(this._originRect, t);
            this._applyPosition(t, e);
          }
        }
        withScrollableContainers(t) {
          return (this._scrollables = t), this;
        }
        withPositions(t) {
          return (
            (this._preferredPositions = t),
            -1 === t.indexOf(this._lastPosition) && (this._lastPosition = null),
            this._validatePositions(),
            this
          );
        }
        withViewportMargin(t) {
          return (this._viewportMargin = t), this;
        }
        withFlexibleDimensions(t = !0) {
          return (this._hasFlexibleDimensions = t), this;
        }
        withGrowAfterOpen(t = !0) {
          return (this._growAfterOpen = t), this;
        }
        withPush(t = !0) {
          return (this._canPush = t), this;
        }
        withLockedPosition(t = !0) {
          return (this._positionLocked = t), this;
        }
        setOrigin(t) {
          return (this._origin = t), this;
        }
        withDefaultOffsetX(t) {
          return (this._offsetX = t), this;
        }
        withDefaultOffsetY(t) {
          return (this._offsetY = t), this;
        }
        withTransformOriginOn(t) {
          return (this._transformOriginSelector = t), this;
        }
        _getOriginPoint(t, e) {
          let r, i;
          if ("center" == e.originX) r = t.left + t.width / 2;
          else {
            const s = this._isRtl() ? t.right : t.left,
              o = this._isRtl() ? t.left : t.right;
            r = "start" == e.originX ? s : o;
          }
          return (
            (i =
              "center" == e.originY
                ? t.top + t.height / 2
                : "top" == e.originY
                  ? t.top
                  : t.bottom),
            { x: r, y: i }
          );
        }
        _getOverlayPoint(t, e, r) {
          let i, s;
          return (
            (i =
              "center" == r.overlayX
                ? -e.width / 2
                : "start" === r.overlayX
                  ? this._isRtl()
                    ? -e.width
                    : 0
                  : this._isRtl()
                    ? 0
                    : -e.width),
            (s =
              "center" == r.overlayY
                ? -e.height / 2
                : "top" == r.overlayY
                  ? 0
                  : -e.height),
            { x: t.x + i, y: t.y + s }
          );
        }
        _getOverlayFit(t, e, r, i) {
          const s = NE(e);
          let { x: o, y: a } = t,
            l = this._getOffset(i, "x"),
            c = this._getOffset(i, "y");
          l && (o += l), c && (a += c);
          let h = 0 - a,
            f = a + s.height - r.height,
            p = this._subtractOverflows(s.width, 0 - o, o + s.width - r.width),
            g = this._subtractOverflows(s.height, h, f),
            y = p * g;
          return {
            visibleArea: y,
            isCompletelyWithinViewport: s.width * s.height === y,
            fitsInViewportVertically: g === s.height,
            fitsInViewportHorizontally: p == s.width,
          };
        }
        _canFitWithFlexibleDimensions(t, e, r) {
          if (this._hasFlexibleDimensions) {
            const i = r.bottom - e.y,
              s = r.right - e.x,
              o = PE(this._overlayRef.getConfig().minHeight),
              a = PE(this._overlayRef.getConfig().minWidth),
              c = t.fitsInViewportHorizontally || (null != a && a <= s);
            return (t.fitsInViewportVertically || (null != o && o <= i)) && c;
          }
          return !1;
        }
        _pushOverlayOnScreen(t, e, r) {
          if (this._previousPushAmount && this._positionLocked)
            return {
              x: t.x + this._previousPushAmount.x,
              y: t.y + this._previousPushAmount.y,
            };
          const i = NE(e),
            s = this._viewportRect,
            o = Math.max(t.x + i.width - s.width, 0),
            a = Math.max(t.y + i.height - s.height, 0),
            l = Math.max(s.top - r.top - t.y, 0),
            c = Math.max(s.left - r.left - t.x, 0);
          let u = 0,
            d = 0;
          return (
            (u =
              i.width <= s.width
                ? c || -o
                : t.x < this._viewportMargin
                  ? s.left - r.left - t.x
                  : 0),
            (d =
              i.height <= s.height
                ? l || -a
                : t.y < this._viewportMargin
                  ? s.top - r.top - t.y
                  : 0),
            (this._previousPushAmount = { x: u, y: d }),
            { x: t.x + u, y: t.y + d }
          );
        }
        _applyPosition(t, e) {
          if (
            (this._setTransformOrigin(t),
            this._setOverlayElementStyles(e, t),
            this._setBoundingBoxStyles(e, t),
            t.panelClass && this._addPanelClasses(t.panelClass),
            (this._lastPosition = t),
            this._positionChanges.observers.length)
          ) {
            const r = this._getScrollVisibility(),
              i = new uB(t, r);
            this._positionChanges.next(i);
          }
          this._isInitialRender = !1;
        }
        _setTransformOrigin(t) {
          if (!this._transformOriginSelector) return;
          const e = this._boundingBox.querySelectorAll(
            this._transformOriginSelector,
          );
          let r,
            i = t.overlayY;
          r =
            "center" === t.overlayX
              ? "center"
              : this._isRtl()
                ? "start" === t.overlayX
                  ? "right"
                  : "left"
                : "start" === t.overlayX
                  ? "left"
                  : "right";
          for (let s = 0; s < e.length; s++)
            e[s].style.transformOrigin = `${r} ${i}`;
        }
        _calculateBoundingBoxRect(t, e) {
          const r = this._viewportRect,
            i = this._isRtl();
          let s, o, a, u, d, h;
          if ("top" === e.overlayY)
            (o = t.y), (s = r.height - o + this._viewportMargin);
          else if ("bottom" === e.overlayY)
            (a = r.height - t.y + 2 * this._viewportMargin),
              (s = r.height - a + this._viewportMargin);
          else {
            const f = Math.min(r.bottom - t.y + r.top, t.y),
              p = this._lastBoundingBoxSize.height;
            (s = 2 * f),
              (o = t.y - f),
              s > p &&
                !this._isInitialRender &&
                !this._growAfterOpen &&
                (o = t.y - p / 2);
          }
          if (("end" === e.overlayX && !i) || ("start" === e.overlayX && i))
            (h = r.width - t.x + this._viewportMargin),
              (u = t.x - this._viewportMargin);
          else if (
            ("start" === e.overlayX && !i) ||
            ("end" === e.overlayX && i)
          )
            (d = t.x), (u = r.right - t.x);
          else {
            const f = Math.min(r.right - t.x + r.left, t.x),
              p = this._lastBoundingBoxSize.width;
            (u = 2 * f),
              (d = t.x - f),
              u > p &&
                !this._isInitialRender &&
                !this._growAfterOpen &&
                (d = t.x - p / 2);
          }
          return { top: o, left: d, bottom: a, right: h, width: u, height: s };
        }
        _setBoundingBoxStyles(t, e) {
          const r = this._calculateBoundingBoxRect(t, e);
          !this._isInitialRender &&
            !this._growAfterOpen &&
            ((r.height = Math.min(r.height, this._lastBoundingBoxSize.height)),
            (r.width = Math.min(r.width, this._lastBoundingBoxSize.width)));
          const i = {};
          if (this._hasExactPosition())
            (i.top = i.left = "0"),
              (i.bottom = i.right = i.maxHeight = i.maxWidth = ""),
              (i.width = i.height = "100%");
          else {
            const s = this._overlayRef.getConfig().maxHeight,
              o = this._overlayRef.getConfig().maxWidth;
            (i.height = He(r.height)),
              (i.top = He(r.top)),
              (i.bottom = He(r.bottom)),
              (i.width = He(r.width)),
              (i.left = He(r.left)),
              (i.right = He(r.right)),
              (i.alignItems =
                "center" === e.overlayX
                  ? "center"
                  : "end" === e.overlayX
                    ? "flex-end"
                    : "flex-start"),
              (i.justifyContent =
                "center" === e.overlayY
                  ? "center"
                  : "bottom" === e.overlayY
                    ? "flex-end"
                    : "flex-start"),
              s && (i.maxHeight = He(s)),
              o && (i.maxWidth = He(o));
          }
          (this._lastBoundingBoxSize = r), ri(this._boundingBox.style, i);
        }
        _resetBoundingBoxStyles() {
          ri(this._boundingBox.style, {
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            height: "",
            width: "",
            alignItems: "",
            justifyContent: "",
          });
        }
        _resetOverlayElementStyles() {
          ri(this._pane.style, {
            top: "",
            left: "",
            bottom: "",
            right: "",
            position: "",
            transform: "",
          });
        }
        _setOverlayElementStyles(t, e) {
          const r = {},
            i = this._hasExactPosition(),
            s = this._hasFlexibleDimensions,
            o = this._overlayRef.getConfig();
          if (i) {
            const u = this._viewportRuler.getViewportScrollPosition();
            ri(r, this._getExactOverlayY(e, t, u)),
              ri(r, this._getExactOverlayX(e, t, u));
          } else r.position = "static";
          let a = "",
            l = this._getOffset(e, "x"),
            c = this._getOffset(e, "y");
          l && (a += `translateX(${l}px) `),
            c && (a += `translateY(${c}px)`),
            (r.transform = a.trim()),
            o.maxHeight &&
              (i ? (r.maxHeight = He(o.maxHeight)) : s && (r.maxHeight = "")),
            o.maxWidth &&
              (i ? (r.maxWidth = He(o.maxWidth)) : s && (r.maxWidth = "")),
            ri(this._pane.style, r);
        }
        _getExactOverlayY(t, e, r) {
          let i = { top: "", bottom: "" },
            s = this._getOverlayPoint(e, this._overlayRect, t);
          this._isPushed &&
            (s = this._pushOverlayOnScreen(s, this._overlayRect, r));
          let o = this._overlayContainer
            .getContainerElement()
            .getBoundingClientRect().top;
          return (
            (s.y -= o),
            "bottom" === t.overlayY
              ? (i.bottom =
                  this._document.documentElement.clientHeight -
                  (s.y + this._overlayRect.height) +
                  "px")
              : (i.top = He(s.y)),
            i
          );
        }
        _getExactOverlayX(t, e, r) {
          let o,
            i = { left: "", right: "" },
            s = this._getOverlayPoint(e, this._overlayRect, t);
          return (
            this._isPushed &&
              (s = this._pushOverlayOnScreen(s, this._overlayRect, r)),
            (o = this._isRtl()
              ? "end" === t.overlayX
                ? "left"
                : "right"
              : "end" === t.overlayX
                ? "right"
                : "left"),
            "right" === o
              ? (i.right =
                  this._document.documentElement.clientWidth -
                  (s.x + this._overlayRect.width) +
                  "px")
              : (i.left = He(s.x)),
            i
          );
        }
        _getScrollVisibility() {
          const t = this._getOriginRect(),
            e = this._pane.getBoundingClientRect(),
            r = this._scrollables.map((i) =>
              i.getElementRef().nativeElement.getBoundingClientRect(),
            );
          return {
            isOriginClipped: OE(t, r),
            isOriginOutsideView: Dp(t, r),
            isOverlayClipped: OE(e, r),
            isOverlayOutsideView: Dp(e, r),
          };
        }
        _subtractOverflows(t, ...e) {
          return e.reduce((r, i) => r - Math.max(i, 0), t);
        }
        _getNarrowedViewportRect() {
          const t = this._document.documentElement.clientWidth,
            e = this._document.documentElement.clientHeight,
            r = this._viewportRuler.getViewportScrollPosition();
          return {
            top: r.top + this._viewportMargin,
            left: r.left + this._viewportMargin,
            right: r.left + t - this._viewportMargin,
            bottom: r.top + e - this._viewportMargin,
            width: t - 2 * this._viewportMargin,
            height: e - 2 * this._viewportMargin,
          };
        }
        _isRtl() {
          return "rtl" === this._overlayRef.getDirection();
        }
        _hasExactPosition() {
          return !this._hasFlexibleDimensions || this._isPushed;
        }
        _getOffset(t, e) {
          return "x" === e
            ? t.offsetX ?? this._offsetX
            : t.offsetY ?? this._offsetY;
        }
        _validatePositions() {}
        _addPanelClasses(t) {
          this._pane &&
            gE(t).forEach((e) => {
              "" !== e &&
                -1 === this._appliedPanelClasses.indexOf(e) &&
                (this._appliedPanelClasses.push(e),
                this._pane.classList.add(e));
            });
        }
        _clearPanelClasses() {
          this._pane &&
            (this._appliedPanelClasses.forEach((t) => {
              this._pane.classList.remove(t);
            }),
            (this._appliedPanelClasses = []));
        }
        _getOriginRect() {
          const t = this._origin;
          if (t instanceof Ie) return t.nativeElement.getBoundingClientRect();
          if (t instanceof Element) return t.getBoundingClientRect();
          const e = t.width || 0,
            r = t.height || 0;
          return {
            top: t.y,
            bottom: t.y + r,
            left: t.x,
            right: t.x + e,
            height: r,
            width: e,
          };
        }
      }
      function ri(n, t) {
        for (let e in t) t.hasOwnProperty(e) && (n[e] = t[e]);
        return n;
      }
      function PE(n) {
        if ("number" != typeof n && null != n) {
          const [t, e] = n.split(pB);
          return e && "px" !== e ? null : parseFloat(t);
        }
        return n || null;
      }
      function NE(n) {
        return {
          top: Math.floor(n.top),
          right: Math.floor(n.right),
          bottom: Math.floor(n.bottom),
          left: Math.floor(n.left),
          width: Math.floor(n.width),
          height: Math.floor(n.height),
        };
      }
      const LE = "cdk-global-overlay-wrapper";
      class mB {
        constructor() {
          (this._cssPosition = "static"),
            (this._topOffset = ""),
            (this._bottomOffset = ""),
            (this._leftOffset = ""),
            (this._rightOffset = ""),
            (this._alignItems = ""),
            (this._justifyContent = ""),
            (this._width = ""),
            (this._height = "");
        }
        attach(t) {
          const e = t.getConfig();
          (this._overlayRef = t),
            this._width && !e.width && t.updateSize({ width: this._width }),
            this._height && !e.height && t.updateSize({ height: this._height }),
            t.hostElement.classList.add(LE),
            (this._isDisposed = !1);
        }
        top(t = "") {
          return (
            (this._bottomOffset = ""),
            (this._topOffset = t),
            (this._alignItems = "flex-start"),
            this
          );
        }
        left(t = "") {
          return (
            (this._rightOffset = ""),
            (this._leftOffset = t),
            (this._justifyContent = "flex-start"),
            this
          );
        }
        bottom(t = "") {
          return (
            (this._topOffset = ""),
            (this._bottomOffset = t),
            (this._alignItems = "flex-end"),
            this
          );
        }
        right(t = "") {
          return (
            (this._leftOffset = ""),
            (this._rightOffset = t),
            (this._justifyContent = "flex-end"),
            this
          );
        }
        width(t = "") {
          return (
            this._overlayRef
              ? this._overlayRef.updateSize({ width: t })
              : (this._width = t),
            this
          );
        }
        height(t = "") {
          return (
            this._overlayRef
              ? this._overlayRef.updateSize({ height: t })
              : (this._height = t),
            this
          );
        }
        centerHorizontally(t = "") {
          return this.left(t), (this._justifyContent = "center"), this;
        }
        centerVertically(t = "") {
          return this.top(t), (this._alignItems = "center"), this;
        }
        apply() {
          if (!this._overlayRef || !this._overlayRef.hasAttached()) return;
          const t = this._overlayRef.overlayElement.style,
            e = this._overlayRef.hostElement.style,
            r = this._overlayRef.getConfig(),
            { width: i, height: s, maxWidth: o, maxHeight: a } = r,
            l = !(
              ("100%" !== i && "100vw" !== i) ||
              (o && "100%" !== o && "100vw" !== o)
            ),
            c = !(
              ("100%" !== s && "100vh" !== s) ||
              (a && "100%" !== a && "100vh" !== a)
            );
          (t.position = this._cssPosition),
            (t.marginLeft = l ? "0" : this._leftOffset),
            (t.marginTop = c ? "0" : this._topOffset),
            (t.marginBottom = this._bottomOffset),
            (t.marginRight = this._rightOffset),
            l
              ? (e.justifyContent = "flex-start")
              : "center" === this._justifyContent
                ? (e.justifyContent = "center")
                : "rtl" === this._overlayRef.getConfig().direction
                  ? "flex-start" === this._justifyContent
                    ? (e.justifyContent = "flex-end")
                    : "flex-end" === this._justifyContent &&
                      (e.justifyContent = "flex-start")
                  : (e.justifyContent = this._justifyContent),
            (e.alignItems = c ? "flex-start" : this._alignItems);
        }
        dispose() {
          if (this._isDisposed || !this._overlayRef) return;
          const t = this._overlayRef.overlayElement.style,
            e = this._overlayRef.hostElement,
            r = e.style;
          e.classList.remove(LE),
            (r.justifyContent =
              r.alignItems =
              t.marginTop =
              t.marginBottom =
              t.marginLeft =
              t.marginRight =
              t.position =
                ""),
            (this._overlayRef = null),
            (this._isDisposed = !0);
        }
      }
      let _B = (() => {
          class n {
            constructor(e, r, i, s) {
              (this._viewportRuler = e),
                (this._document = r),
                (this._platform = i),
                (this._overlayContainer = s);
            }
            global() {
              return new mB();
            }
            flexibleConnectedTo(e) {
              return new gB(
                e,
                this._viewportRuler,
                this._document,
                this._platform,
                this._overlayContainer,
              );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(SE), m(Y), m(Nn), m(Ep));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        yB = 0,
        ys = (() => {
          class n {
            constructor(e, r, i, s, o, a, l, c, u, d, h) {
              (this.scrollStrategies = e),
                (this._overlayContainer = r),
                (this._componentFactoryResolver = i),
                (this._positionBuilder = s),
                (this._keyboardDispatcher = o),
                (this._injector = a),
                (this._ngZone = l),
                (this._document = c),
                (this._directionality = u),
                (this._location = d),
                (this._outsideClickDispatcher = h);
            }
            create(e) {
              const r = this._createHostElement(),
                i = this._createPaneElement(r),
                s = this._createPortalOutlet(i),
                o = new wp(e);
              return (
                (o.direction = o.direction || this._directionality.value),
                new fB(
                  s,
                  r,
                  i,
                  o,
                  this._ngZone,
                  this._keyboardDispatcher,
                  this._document,
                  this._location,
                  this._outsideClickDispatcher,
                )
              );
            }
            position() {
              return this._positionBuilder;
            }
            _createPaneElement(e) {
              const r = this._document.createElement("div");
              return (
                (r.id = "cdk-overlay-" + yB++),
                r.classList.add("cdk-overlay-pane"),
                e.appendChild(r),
                r
              );
            }
            _createHostElement() {
              const e = this._document.createElement("div");
              return (
                this._overlayContainer.getContainerElement().appendChild(e), e
              );
            }
            _createPortalOutlet(e) {
              return (
                this._appRef || (this._appRef = this._injector.get(ls)),
                new eB(
                  e,
                  this._componentFactoryResolver,
                  this._appRef,
                  this._injector,
                  this._document,
                )
              );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                m(cB),
                m(Ep),
                m(Gr),
                m(_B),
                m(dB),
                m(Ne),
                m(le),
                m(Y),
                m(Ic),
                m(xo),
                m(hB),
              );
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })();
      const CB = {
        provide: new w("cdk-connected-overlay-scroll-strategy"),
        deps: [ys],
        useFactory: function bB(n) {
          return () => n.scrollStrategies.reposition();
        },
      };
      let VE = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵmod = ve({ type: n })),
          (n.ɵinj = _e({ providers: [ys, CB], imports: [[Ko, TE, ME], ME] })),
          n
        );
      })();
      class Ct extends de {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const e = super._subscribe(t);
          return e && !e.closed && t.next(this._value), e;
        }
        getValue() {
          if (this.hasError) throw this.thrownError;
          if (this.closed) throw new _i();
          return this._value;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function Ap(n, ...t) {
        return t.length
          ? t.some((e) => n[e])
          : n.altKey || n.shiftKey || n.ctrlKey || n.metaKey;
      }
      function Tr() {}
      function $e(n, t, e) {
        return function (i) {
          return i.lift(new NB(n, t, e));
        };
      }
      class NB {
        constructor(t, e, r) {
          (this.nextOrObserver = t), (this.error = e), (this.complete = r);
        }
        call(t, e) {
          return e.subscribe(
            new LB(t, this.nextOrObserver, this.error, this.complete),
          );
        }
      }
      class LB extends ge {
        constructor(t, e, r, i) {
          super(t),
            (this._tapNext = Tr),
            (this._tapError = Tr),
            (this._tapComplete = Tr),
            (this._tapError = r || Tr),
            (this._tapComplete = i || Tr),
            ur(e)
              ? ((this._context = this), (this._tapNext = e))
              : e &&
                ((this._context = e),
                (this._tapNext = e.next || Tr),
                (this._tapError = e.error || Tr),
                (this._tapComplete = e.complete || Tr));
        }
        _next(t) {
          try {
            this._tapNext.call(this._context, t);
          } catch (e) {
            return void this.destination.error(e);
          }
          this.destination.next(t);
        }
        _error(t) {
          try {
            this._tapError.call(this._context, t);
          } catch (e) {
            return void this.destination.error(e);
          }
          this.destination.error(t);
        }
        _complete() {
          try {
            this._tapComplete.call(this._context);
          } catch (t) {
            return void this.destination.error(t);
          }
          return this.destination.complete();
        }
      }
      class BB {
        constructor(t, e) {
          (this.dueTime = t), (this.scheduler = e);
        }
        call(t, e) {
          return e.subscribe(new jB(t, this.dueTime, this.scheduler));
        }
      }
      class jB extends ge {
        constructor(t, e, r) {
          super(t),
            (this.dueTime = e),
            (this.scheduler = r),
            (this.debouncedSubscription = null),
            (this.lastValue = null),
            (this.hasValue = !1);
        }
        _next(t) {
          this.clearDebounce(),
            (this.lastValue = t),
            (this.hasValue = !0),
            this.add(
              (this.debouncedSubscription = this.scheduler.schedule(
                UB,
                this.dueTime,
                this,
              )),
            );
        }
        _complete() {
          this.debouncedNext(), this.destination.complete();
        }
        debouncedNext() {
          if ((this.clearDebounce(), this.hasValue)) {
            const { lastValue: t } = this;
            (this.lastValue = null),
              (this.hasValue = !1),
              this.destination.next(t);
          }
        }
        clearDebounce() {
          const t = this.debouncedSubscription;
          null !== t &&
            (this.remove(t),
            t.unsubscribe(),
            (this.debouncedSubscription = null));
        }
      }
      function UB(n) {
        n.debouncedNext();
      }
      class $B {
        constructor(t) {
          this.total = t;
        }
        call(t, e) {
          return e.subscribe(new zB(t, this.total));
        }
      }
      class zB extends ge {
        constructor(t, e) {
          super(t), (this.total = e), (this.count = 0);
        }
        _next(t) {
          ++this.count > this.total && this.destination.next(t);
        }
      }
      function HE(n, t) {
        return (e) => e.lift(new GB(n, t));
      }
      class GB {
        constructor(t, e) {
          (this.compare = t), (this.keySelector = e);
        }
        call(t, e) {
          return e.subscribe(new WB(t, this.compare, this.keySelector));
        }
      }
      class WB extends ge {
        constructor(t, e, r) {
          super(t),
            (this.keySelector = r),
            (this.hasKey = !1),
            "function" == typeof e && (this.compare = e);
        }
        compare(t, e) {
          return t === e;
        }
        _next(t) {
          let e;
          try {
            const { keySelector: i } = this;
            e = i ? i(t) : t;
          } catch (i) {
            return this.destination.error(i);
          }
          let r = !1;
          if (this.hasKey)
            try {
              const { compare: i } = this;
              r = i(this.key, e);
            } catch (i) {
              return this.destination.error(i);
            }
          else this.hasKey = !0;
          r || ((this.key = e), this.destination.next(t));
        }
      }
      class ZB extends class YB {
        constructor(t) {
          (this._items = t),
            (this._activeItemIndex = -1),
            (this._activeItem = null),
            (this._wrap = !1),
            (this._letterKeyStream = new de()),
            (this._typeaheadSubscription = ue.EMPTY),
            (this._vertical = !0),
            (this._allowedModifierKeys = []),
            (this._homeAndEnd = !1),
            (this._skipPredicateFn = (e) => e.disabled),
            (this._pressedLetters = []),
            (this.tabOut = new de()),
            (this.change = new de()),
            t instanceof is &&
              t.changes.subscribe((e) => {
                if (this._activeItem) {
                  const i = e.toArray().indexOf(this._activeItem);
                  i > -1 &&
                    i !== this._activeItemIndex &&
                    (this._activeItemIndex = i);
                }
              });
        }
        skipPredicate(t) {
          return (this._skipPredicateFn = t), this;
        }
        withWrap(t = !0) {
          return (this._wrap = t), this;
        }
        withVerticalOrientation(t = !0) {
          return (this._vertical = t), this;
        }
        withHorizontalOrientation(t) {
          return (this._horizontal = t), this;
        }
        withAllowedModifierKeys(t) {
          return (this._allowedModifierKeys = t), this;
        }
        withTypeAhead(t = 200) {
          return (
            this._typeaheadSubscription.unsubscribe(),
            (this._typeaheadSubscription = this._letterKeyStream
              .pipe(
                $e((e) => this._pressedLetters.push(e)),
                (function VB(n, t = Mc) {
                  return (e) => e.lift(new BB(n, t));
                })(t),
                Ze(() => this._pressedLetters.length > 0),
                U(() => this._pressedLetters.join("")),
              )
              .subscribe((e) => {
                const r = this._getItemsArray();
                for (let i = 1; i < r.length + 1; i++) {
                  const s = (this._activeItemIndex + i) % r.length,
                    o = r[s];
                  if (
                    !this._skipPredicateFn(o) &&
                    0 === o.getLabel().toUpperCase().trim().indexOf(e)
                  ) {
                    this.setActiveItem(s);
                    break;
                  }
                }
                this._pressedLetters = [];
              })),
            this
          );
        }
        withHomeAndEnd(t = !0) {
          return (this._homeAndEnd = t), this;
        }
        setActiveItem(t) {
          const e = this._activeItem;
          this.updateActiveItem(t),
            this._activeItem !== e && this.change.next(this._activeItemIndex);
        }
        onKeydown(t) {
          const e = t.keyCode,
            i = ["altKey", "ctrlKey", "metaKey", "shiftKey"].every(
              (s) => !t[s] || this._allowedModifierKeys.indexOf(s) > -1,
            );
          switch (e) {
            case 9:
              return void this.tabOut.next();
            case 40:
              if (this._vertical && i) {
                this.setNextItemActive();
                break;
              }
              return;
            case 38:
              if (this._vertical && i) {
                this.setPreviousItemActive();
                break;
              }
              return;
            case 39:
              if (this._horizontal && i) {
                "rtl" === this._horizontal
                  ? this.setPreviousItemActive()
                  : this.setNextItemActive();
                break;
              }
              return;
            case 37:
              if (this._horizontal && i) {
                "rtl" === this._horizontal
                  ? this.setNextItemActive()
                  : this.setPreviousItemActive();
                break;
              }
              return;
            case 36:
              if (this._homeAndEnd && i) {
                this.setFirstItemActive();
                break;
              }
              return;
            case 35:
              if (this._homeAndEnd && i) {
                this.setLastItemActive();
                break;
              }
              return;
            default:
              return void (
                (i || Ap(t, "shiftKey")) &&
                (t.key && 1 === t.key.length
                  ? this._letterKeyStream.next(t.key.toLocaleUpperCase())
                  : ((e >= 65 && e <= 90) || (e >= 48 && e <= 57)) &&
                    this._letterKeyStream.next(String.fromCharCode(e)))
              );
          }
          (this._pressedLetters = []), t.preventDefault();
        }
        get activeItemIndex() {
          return this._activeItemIndex;
        }
        get activeItem() {
          return this._activeItem;
        }
        isTyping() {
          return this._pressedLetters.length > 0;
        }
        setFirstItemActive() {
          this._setActiveItemByIndex(0, 1);
        }
        setLastItemActive() {
          this._setActiveItemByIndex(this._items.length - 1, -1);
        }
        setNextItemActive() {
          this._activeItemIndex < 0
            ? this.setFirstItemActive()
            : this._setActiveItemByDelta(1);
        }
        setPreviousItemActive() {
          this._activeItemIndex < 0 && this._wrap
            ? this.setLastItemActive()
            : this._setActiveItemByDelta(-1);
        }
        updateActiveItem(t) {
          const e = this._getItemsArray(),
            r = "number" == typeof t ? t : e.indexOf(t);
          (this._activeItem = e[r] ?? null), (this._activeItemIndex = r);
        }
        _setActiveItemByDelta(t) {
          this._wrap
            ? this._setActiveInWrapMode(t)
            : this._setActiveInDefaultMode(t);
        }
        _setActiveInWrapMode(t) {
          const e = this._getItemsArray();
          for (let r = 1; r <= e.length; r++) {
            const i = (this._activeItemIndex + t * r + e.length) % e.length;
            if (!this._skipPredicateFn(e[i])) return void this.setActiveItem(i);
          }
        }
        _setActiveInDefaultMode(t) {
          this._setActiveItemByIndex(this._activeItemIndex + t, t);
        }
        _setActiveItemByIndex(t, e) {
          const r = this._getItemsArray();
          if (r[t]) {
            for (; this._skipPredicateFn(r[t]); ) if (!r[(t += e)]) return;
            this.setActiveItem(t);
          }
        }
        _getItemsArray() {
          return this._items instanceof is
            ? this._items.toArray()
            : this._items;
        }
      } {
        constructor() {
          super(...arguments), (this._origin = "program");
        }
        setFocusOrigin(t) {
          return (this._origin = t), this;
        }
        setActiveItem(t) {
          super.setActiveItem(t),
            this.activeItem && this.activeItem.focus(this._origin);
        }
      }
      let GE = (() => {
        class n {
          constructor(e) {
            this._platform = e;
          }
          isDisabled(e) {
            return e.hasAttribute("disabled");
          }
          isVisible(e) {
            return (
              (function XB(n) {
                return !!(
                  n.offsetWidth ||
                  n.offsetHeight ||
                  ("function" == typeof n.getClientRects &&
                    n.getClientRects().length)
                );
              })(e) && "visible" === getComputedStyle(e).visibility
            );
          }
          isTabbable(e) {
            if (!this._platform.isBrowser) return !1;
            const r = (function QB(n) {
              try {
                return n.frameElement;
              } catch {
                return null;
              }
            })(
              (function a2(n) {
                return (
                  (n.ownerDocument && n.ownerDocument.defaultView) || window
                );
              })(e),
            );
            if (r && (-1 === qE(r) || !this.isVisible(r))) return !1;
            let i = e.nodeName.toLowerCase(),
              s = qE(e);
            return e.hasAttribute("contenteditable")
              ? -1 !== s
              : !(
                  "iframe" === i ||
                  "object" === i ||
                  (this._platform.WEBKIT &&
                    this._platform.IOS &&
                    !(function s2(n) {
                      let t = n.nodeName.toLowerCase(),
                        e = "input" === t && n.type;
                      return (
                        "text" === e ||
                        "password" === e ||
                        "select" === t ||
                        "textarea" === t
                      );
                    })(e))
                ) &&
                  ("audio" === i
                    ? !!e.hasAttribute("controls") && -1 !== s
                    : "video" === i
                      ? -1 !== s &&
                        (null !== s ||
                          this._platform.FIREFOX ||
                          e.hasAttribute("controls"))
                      : e.tabIndex >= 0);
          }
          isFocusable(e, r) {
            return (
              (function o2(n) {
                return (
                  !(function e2(n) {
                    return (
                      (function n2(n) {
                        return "input" == n.nodeName.toLowerCase();
                      })(n) && "hidden" == n.type
                    );
                  })(n) &&
                  ((function JB(n) {
                    let t = n.nodeName.toLowerCase();
                    return (
                      "input" === t ||
                      "select" === t ||
                      "button" === t ||
                      "textarea" === t
                    );
                  })(n) ||
                    (function t2(n) {
                      return (
                        (function r2(n) {
                          return "a" == n.nodeName.toLowerCase();
                        })(n) && n.hasAttribute("href")
                      );
                    })(n) ||
                    n.hasAttribute("contenteditable") ||
                    WE(n))
                );
              })(e) &&
              !this.isDisabled(e) &&
              (r?.ignoreVisibility || this.isVisible(e))
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Nn));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function WE(n) {
        if (!n.hasAttribute("tabindex") || void 0 === n.tabIndex) return !1;
        let t = n.getAttribute("tabindex");
        return !(!t || isNaN(parseInt(t, 10)));
      }
      function qE(n) {
        if (!WE(n)) return null;
        const t = parseInt(n.getAttribute("tabindex") || "", 10);
        return isNaN(t) ? -1 : t;
      }
      class l2 {
        constructor(t, e, r, i, s = !1) {
          (this._element = t),
            (this._checker = e),
            (this._ngZone = r),
            (this._document = i),
            (this._hasAttached = !1),
            (this.startAnchorListener = () => this.focusLastTabbableElement()),
            (this.endAnchorListener = () => this.focusFirstTabbableElement()),
            (this._enabled = !0),
            s || this.attachAnchors();
        }
        get enabled() {
          return this._enabled;
        }
        set enabled(t) {
          (this._enabled = t),
            this._startAnchor &&
              this._endAnchor &&
              (this._toggleAnchorTabIndex(t, this._startAnchor),
              this._toggleAnchorTabIndex(t, this._endAnchor));
        }
        destroy() {
          const t = this._startAnchor,
            e = this._endAnchor;
          t &&
            (t.removeEventListener("focus", this.startAnchorListener),
            t.remove()),
            e &&
              (e.removeEventListener("focus", this.endAnchorListener),
              e.remove()),
            (this._startAnchor = this._endAnchor = null),
            (this._hasAttached = !1);
        }
        attachAnchors() {
          return (
            !!this._hasAttached ||
            (this._ngZone.runOutsideAngular(() => {
              this._startAnchor ||
                ((this._startAnchor = this._createAnchor()),
                this._startAnchor.addEventListener(
                  "focus",
                  this.startAnchorListener,
                )),
                this._endAnchor ||
                  ((this._endAnchor = this._createAnchor()),
                  this._endAnchor.addEventListener(
                    "focus",
                    this.endAnchorListener,
                  ));
            }),
            this._element.parentNode &&
              (this._element.parentNode.insertBefore(
                this._startAnchor,
                this._element,
              ),
              this._element.parentNode.insertBefore(
                this._endAnchor,
                this._element.nextSibling,
              ),
              (this._hasAttached = !0)),
            this._hasAttached)
          );
        }
        focusInitialElementWhenReady(t) {
          return new Promise((e) => {
            this._executeOnStable(() => e(this.focusInitialElement(t)));
          });
        }
        focusFirstTabbableElementWhenReady(t) {
          return new Promise((e) => {
            this._executeOnStable(() => e(this.focusFirstTabbableElement(t)));
          });
        }
        focusLastTabbableElementWhenReady(t) {
          return new Promise((e) => {
            this._executeOnStable(() => e(this.focusLastTabbableElement(t)));
          });
        }
        _getRegionBoundary(t) {
          const e = this._element.querySelectorAll(
            `[cdk-focus-region-${t}], [cdkFocusRegion${t}], [cdk-focus-${t}]`,
          );
          return "start" == t
            ? e.length
              ? e[0]
              : this._getFirstTabbableElement(this._element)
            : e.length
              ? e[e.length - 1]
              : this._getLastTabbableElement(this._element);
        }
        focusInitialElement(t) {
          const e = this._element.querySelector(
            "[cdk-focus-initial], [cdkFocusInitial]",
          );
          if (e) {
            if (!this._checker.isFocusable(e)) {
              const r = this._getFirstTabbableElement(e);
              return r?.focus(t), !!r;
            }
            return e.focus(t), !0;
          }
          return this.focusFirstTabbableElement(t);
        }
        focusFirstTabbableElement(t) {
          const e = this._getRegionBoundary("start");
          return e && e.focus(t), !!e;
        }
        focusLastTabbableElement(t) {
          const e = this._getRegionBoundary("end");
          return e && e.focus(t), !!e;
        }
        hasAttached() {
          return this._hasAttached;
        }
        _getFirstTabbableElement(t) {
          if (this._checker.isFocusable(t) && this._checker.isTabbable(t))
            return t;
          const e = t.children;
          for (let r = 0; r < e.length; r++) {
            const i =
              e[r].nodeType === this._document.ELEMENT_NODE
                ? this._getFirstTabbableElement(e[r])
                : null;
            if (i) return i;
          }
          return null;
        }
        _getLastTabbableElement(t) {
          if (this._checker.isFocusable(t) && this._checker.isTabbable(t))
            return t;
          const e = t.children;
          for (let r = e.length - 1; r >= 0; r--) {
            const i =
              e[r].nodeType === this._document.ELEMENT_NODE
                ? this._getLastTabbableElement(e[r])
                : null;
            if (i) return i;
          }
          return null;
        }
        _createAnchor() {
          const t = this._document.createElement("div");
          return (
            this._toggleAnchorTabIndex(this._enabled, t),
            t.classList.add("cdk-visually-hidden"),
            t.classList.add("cdk-focus-trap-anchor"),
            t.setAttribute("aria-hidden", "true"),
            t
          );
        }
        _toggleAnchorTabIndex(t, e) {
          t ? e.setAttribute("tabindex", "0") : e.removeAttribute("tabindex");
        }
        toggleAnchors(t) {
          this._startAnchor &&
            this._endAnchor &&
            (this._toggleAnchorTabIndex(t, this._startAnchor),
            this._toggleAnchorTabIndex(t, this._endAnchor));
        }
        _executeOnStable(t) {
          this._ngZone.isStable
            ? t()
            : this._ngZone.onStable.pipe(Tt(1)).subscribe(t);
        }
      }
      let c2 = (() => {
        class n {
          constructor(e, r, i) {
            (this._checker = e), (this._ngZone = r), (this._document = i);
          }
          create(e, r = !1) {
            return new l2(e, this._checker, this._ngZone, this._document, r);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(GE), m(le), m(Y));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function Tp(n) {
        return 0 === n.offsetX && 0 === n.offsetY;
      }
      function Ip(n) {
        const t =
          (n.touches && n.touches[0]) ||
          (n.changedTouches && n.changedTouches[0]);
        return !(
          !t ||
          -1 !== t.identifier ||
          (null != t.radiusX && 1 !== t.radiusX) ||
          (null != t.radiusY && 1 !== t.radiusY)
        );
      }
      const u2 = new w("cdk-input-modality-detector-options"),
        d2 = { ignoreKeys: [18, 17, 224, 91, 16] },
        vs = Ac({ passive: !0, capture: !0 });
      let h2 = (() => {
        class n {
          constructor(e, r, i, s) {
            (this._platform = e),
              (this._mostRecentTarget = null),
              (this._modality = new Ct(null)),
              (this._lastTouchMs = 0),
              (this._onKeydown = (o) => {
                this._options?.ignoreKeys?.some((a) => a === o.keyCode) ||
                  (this._modality.next("keyboard"),
                  (this._mostRecentTarget = ni(o)));
              }),
              (this._onMousedown = (o) => {
                Date.now() - this._lastTouchMs < 650 ||
                  (this._modality.next(Tp(o) ? "keyboard" : "mouse"),
                  (this._mostRecentTarget = ni(o)));
              }),
              (this._onTouchstart = (o) => {
                Ip(o)
                  ? this._modality.next("keyboard")
                  : ((this._lastTouchMs = Date.now()),
                    this._modality.next("touch"),
                    (this._mostRecentTarget = ni(o)));
              }),
              (this._options = { ...d2, ...s }),
              (this.modalityDetected = this._modality.pipe(
                (function HB(n) {
                  return (t) => t.lift(new $B(n));
                })(1),
              )),
              (this.modalityChanged = this.modalityDetected.pipe(HE())),
              e.isBrowser &&
                r.runOutsideAngular(() => {
                  i.addEventListener("keydown", this._onKeydown, vs),
                    i.addEventListener("mousedown", this._onMousedown, vs),
                    i.addEventListener("touchstart", this._onTouchstart, vs);
                });
          }
          get mostRecentModality() {
            return this._modality.value;
          }
          ngOnDestroy() {
            this._modality.complete(),
              this._platform.isBrowser &&
                (document.removeEventListener("keydown", this._onKeydown, vs),
                document.removeEventListener(
                  "mousedown",
                  this._onMousedown,
                  vs,
                ),
                document.removeEventListener(
                  "touchstart",
                  this._onTouchstart,
                  vs,
                ));
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Nn), m(le), m(Y), m(u2, 8));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const p2 = new w("cdk-focus-monitor-default-options"),
        Oc = Ac({ passive: !0, capture: !0 });
      let kc = (() => {
        class n {
          constructor(e, r, i, s, o) {
            (this._ngZone = e),
              (this._platform = r),
              (this._inputModalityDetector = i),
              (this._origin = null),
              (this._windowFocused = !1),
              (this._originFromTouchInteraction = !1),
              (this._elementInfo = new Map()),
              (this._monitoredElementCount = 0),
              (this._rootNodeFocusListenerCount = new Map()),
              (this._windowFocusListener = () => {
                (this._windowFocused = !0),
                  (this._windowFocusTimeoutId = setTimeout(
                    () => (this._windowFocused = !1),
                  ));
              }),
              (this._stopInputModalityDetector = new de()),
              (this._rootNodeFocusAndBlurListener = (a) => {
                const l = ni(a),
                  c = "focus" === a.type ? this._onFocus : this._onBlur;
                for (let u = l; u; u = u.parentElement) c.call(this, a, u);
              }),
              (this._document = s),
              (this._detectionMode = o?.detectionMode || 0);
          }
          monitor(e, r = !1) {
            const i = gs(e);
            if (!this._platform.isBrowser || 1 !== i.nodeType) return k(null);
            const s =
                (function qV(n) {
                  if (
                    (function WV() {
                      if (null == pp) {
                        const n = typeof document < "u" ? document.head : null;
                        pp = !(!n || (!n.createShadowRoot && !n.attachShadow));
                      }
                      return pp;
                    })()
                  ) {
                    const t = n.getRootNode ? n.getRootNode() : null;
                    if (
                      typeof ShadowRoot < "u" &&
                      ShadowRoot &&
                      t instanceof ShadowRoot
                    )
                      return t;
                  }
                  return null;
                })(i) || this._getDocument(),
              o = this._elementInfo.get(i);
            if (o) return r && (o.checkChildren = !0), o.subject;
            const a = { checkChildren: r, subject: new de(), rootNode: s };
            return (
              this._elementInfo.set(i, a),
              this._registerGlobalListeners(a),
              a.subject
            );
          }
          stopMonitoring(e) {
            const r = gs(e),
              i = this._elementInfo.get(r);
            i &&
              (i.subject.complete(),
              this._setClasses(r),
              this._elementInfo.delete(r),
              this._removeGlobalListeners(i));
          }
          focusVia(e, r, i) {
            const s = gs(e);
            s === this._getDocument().activeElement
              ? this._getClosestElementsInfo(s).forEach(([a, l]) =>
                  this._originChanged(a, r, l),
                )
              : (this._setOrigin(r),
                "function" == typeof s.focus && s.focus(i));
          }
          ngOnDestroy() {
            this._elementInfo.forEach((e, r) => this.stopMonitoring(r));
          }
          _getDocument() {
            return this._document || document;
          }
          _getWindow() {
            return this._getDocument().defaultView || window;
          }
          _getFocusOrigin(e) {
            return this._origin
              ? this._originFromTouchInteraction
                ? this._shouldBeAttributedToTouch(e)
                  ? "touch"
                  : "program"
                : this._origin
              : this._windowFocused && this._lastFocusOrigin
                ? this._lastFocusOrigin
                : "program";
          }
          _shouldBeAttributedToTouch(e) {
            return (
              1 === this._detectionMode ||
              !!e?.contains(this._inputModalityDetector._mostRecentTarget)
            );
          }
          _setClasses(e, r) {
            e.classList.toggle("cdk-focused", !!r),
              e.classList.toggle("cdk-touch-focused", "touch" === r),
              e.classList.toggle("cdk-keyboard-focused", "keyboard" === r),
              e.classList.toggle("cdk-mouse-focused", "mouse" === r),
              e.classList.toggle("cdk-program-focused", "program" === r);
          }
          _setOrigin(e, r = !1) {
            this._ngZone.runOutsideAngular(() => {
              (this._origin = e),
                (this._originFromTouchInteraction = "touch" === e && r),
                0 === this._detectionMode &&
                  (clearTimeout(this._originTimeoutId),
                  (this._originTimeoutId = setTimeout(
                    () => (this._origin = null),
                    this._originFromTouchInteraction ? 650 : 1,
                  )));
            });
          }
          _onFocus(e, r) {
            const i = this._elementInfo.get(r),
              s = ni(e);
            !i ||
              (!i.checkChildren && r !== s) ||
              this._originChanged(r, this._getFocusOrigin(s), i);
          }
          _onBlur(e, r) {
            const i = this._elementInfo.get(r);
            !i ||
              (i.checkChildren &&
                e.relatedTarget instanceof Node &&
                r.contains(e.relatedTarget)) ||
              (this._setClasses(r), this._emitOrigin(i.subject, null));
          }
          _emitOrigin(e, r) {
            this._ngZone.run(() => e.next(r));
          }
          _registerGlobalListeners(e) {
            if (!this._platform.isBrowser) return;
            const r = e.rootNode,
              i = this._rootNodeFocusListenerCount.get(r) || 0;
            i ||
              this._ngZone.runOutsideAngular(() => {
                r.addEventListener(
                  "focus",
                  this._rootNodeFocusAndBlurListener,
                  Oc,
                ),
                  r.addEventListener(
                    "blur",
                    this._rootNodeFocusAndBlurListener,
                    Oc,
                  );
              }),
              this._rootNodeFocusListenerCount.set(r, i + 1),
              1 == ++this._monitoredElementCount &&
                (this._ngZone.runOutsideAngular(() => {
                  this._getWindow().addEventListener(
                    "focus",
                    this._windowFocusListener,
                  );
                }),
                this._inputModalityDetector.modalityDetected
                  .pipe(xc(this._stopInputModalityDetector))
                  .subscribe((s) => {
                    this._setOrigin(s, !0);
                  }));
          }
          _removeGlobalListeners(e) {
            const r = e.rootNode;
            if (this._rootNodeFocusListenerCount.has(r)) {
              const i = this._rootNodeFocusListenerCount.get(r);
              i > 1
                ? this._rootNodeFocusListenerCount.set(r, i - 1)
                : (r.removeEventListener(
                    "focus",
                    this._rootNodeFocusAndBlurListener,
                    Oc,
                  ),
                  r.removeEventListener(
                    "blur",
                    this._rootNodeFocusAndBlurListener,
                    Oc,
                  ),
                  this._rootNodeFocusListenerCount.delete(r));
            }
            --this._monitoredElementCount ||
              (this._getWindow().removeEventListener(
                "focus",
                this._windowFocusListener,
              ),
              this._stopInputModalityDetector.next(),
              clearTimeout(this._windowFocusTimeoutId),
              clearTimeout(this._originTimeoutId));
          }
          _originChanged(e, r, i) {
            this._setClasses(e, r),
              this._emitOrigin(i.subject, r),
              (this._lastFocusOrigin = r);
          }
          _getClosestElementsInfo(e) {
            const r = [];
            return (
              this._elementInfo.forEach((i, s) => {
                (s === e || (i.checkChildren && s.contains(e))) &&
                  r.push([s, i]);
              }),
              r
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(le), m(Nn), m(h2), m(Y, 8), m(p2, 8));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const YE = "cdk-high-contrast-black-on-white",
        ZE = "cdk-high-contrast-white-on-black",
        Rp = "cdk-high-contrast-active";
      let g2 = (() => {
        class n {
          constructor(e, r) {
            (this._platform = e), (this._document = r);
          }
          getHighContrastMode() {
            if (!this._platform.isBrowser) return 0;
            const e = this._document.createElement("div");
            (e.style.backgroundColor = "rgb(1,2,3)"),
              (e.style.position = "absolute"),
              this._document.body.appendChild(e);
            const r = this._document.defaultView || window,
              i = r && r.getComputedStyle ? r.getComputedStyle(e) : null,
              s = ((i && i.backgroundColor) || "").replace(/ /g, "");
            switch ((e.remove(), s)) {
              case "rgb(0,0,0)":
                return 2;
              case "rgb(255,255,255)":
                return 1;
            }
            return 0;
          }
          _applyBodyHighContrastModeCssClasses() {
            if (
              !this._hasCheckedHighContrastMode &&
              this._platform.isBrowser &&
              this._document.body
            ) {
              const e = this._document.body.classList;
              e.remove(Rp),
                e.remove(YE),
                e.remove(ZE),
                (this._hasCheckedHighContrastMode = !0);
              const r = this.getHighContrastMode();
              1 === r
                ? (e.add(Rp), e.add(YE))
                : 2 === r && (e.add(Rp), e.add(ZE));
            }
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Nn), m(Y));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const _2 = new w("mat-sanity-checks", {
        providedIn: "root",
        factory: function m2() {
          return !0;
        },
      });
      let Ln = (() => {
        class n {
          constructor(e, r, i) {
            (this._sanityChecks = r),
              (this._document = i),
              (this._hasDoneGlobalChecks = !1),
              e._applyBodyHighContrastModeCssClasses(),
              this._hasDoneGlobalChecks || (this._hasDoneGlobalChecks = !0);
          }
          _checkIsEnabled(e) {
            return (
              !mp() &&
              ("boolean" == typeof this._sanityChecks
                ? this._sanityChecks
                : !!this._sanityChecks[e])
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(g2), m(_2, 8), m(Y));
          }),
          (n.ɵmod = ve({ type: n })),
          (n.ɵinj = _e({ imports: [[Ko], Ko] })),
          n
        );
      })();
      function JE(n) {
        return class extends n {
          constructor(...t) {
            super(...t), (this._disabled = !1);
          }
          get disabled() {
            return this._disabled;
          }
          set disabled(t) {
            this._disabled = Wo(t);
          }
        };
      }
      function eS(n, t) {
        return class extends n {
          constructor(...e) {
            super(...e), (this.defaultColor = t), (this.color = t);
          }
          get color() {
            return this._color;
          }
          set color(e) {
            const r = e || this.defaultColor;
            r !== this._color &&
              (this._color &&
                this._elementRef.nativeElement.classList.remove(
                  `mat-${this._color}`,
                ),
              r && this._elementRef.nativeElement.classList.add(`mat-${r}`),
              (this._color = r));
          }
        };
      }
      function tS(n) {
        return class extends n {
          constructor(...t) {
            super(...t), (this._disableRipple = !1);
          }
          get disableRipple() {
            return this._disableRipple;
          }
          set disableRipple(t) {
            this._disableRipple = Wo(t);
          }
        };
      }
      class v2 {
        constructor(t, e, r) {
          (this._renderer = t),
            (this.element = e),
            (this.config = r),
            (this.state = 3);
        }
        fadeOut() {
          this._renderer.fadeOutRipple(this);
        }
      }
      const nS = { enterDuration: 225, exitDuration: 150 },
        xp = Ac({ passive: !0 }),
        rS = ["mousedown", "touchstart"],
        iS = ["mouseup", "mouseleave", "touchend", "touchcancel"];
      class C2 {
        constructor(t, e, r, i) {
          (this._target = t),
            (this._ngZone = e),
            (this._isPointerDown = !1),
            (this._activeRipples = new Set()),
            (this._pointerUpEventsRegistered = !1),
            i.isBrowser && (this._containerElement = gs(r));
        }
        fadeInRipple(t, e, r = {}) {
          const i = (this._containerRect =
              this._containerRect ||
              this._containerElement.getBoundingClientRect()),
            s = { ...nS, ...r.animation };
          r.centered &&
            ((t = i.left + i.width / 2), (e = i.top + i.height / 2));
          const o =
              r.radius ||
              (function w2(n, t, e) {
                const r = Math.max(Math.abs(n - e.left), Math.abs(n - e.right)),
                  i = Math.max(Math.abs(t - e.top), Math.abs(t - e.bottom));
                return Math.sqrt(r * r + i * i);
              })(t, e, i),
            a = t - i.left,
            l = e - i.top,
            c = s.enterDuration,
            u = document.createElement("div");
          u.classList.add("mat-ripple-element"),
            (u.style.left = a - o + "px"),
            (u.style.top = l - o + "px"),
            (u.style.height = 2 * o + "px"),
            (u.style.width = 2 * o + "px"),
            null != r.color && (u.style.backgroundColor = r.color),
            (u.style.transitionDuration = `${c}ms`),
            this._containerElement.appendChild(u),
            (function D2(n) {
              window.getComputedStyle(n).getPropertyValue("opacity");
            })(u),
            (u.style.transform = "scale(1)");
          const d = new v2(this, u, r);
          return (
            (d.state = 0),
            this._activeRipples.add(d),
            r.persistent || (this._mostRecentTransientRipple = d),
            this._runTimeoutOutsideZone(() => {
              const h = d === this._mostRecentTransientRipple;
              (d.state = 1),
                !r.persistent && (!h || !this._isPointerDown) && d.fadeOut();
            }, c),
            d
          );
        }
        fadeOutRipple(t) {
          const e = this._activeRipples.delete(t);
          if (
            (t === this._mostRecentTransientRipple &&
              (this._mostRecentTransientRipple = null),
            this._activeRipples.size || (this._containerRect = null),
            !e)
          )
            return;
          const r = t.element,
            i = { ...nS, ...t.config.animation };
          (r.style.transitionDuration = `${i.exitDuration}ms`),
            (r.style.opacity = "0"),
            (t.state = 2),
            this._runTimeoutOutsideZone(() => {
              (t.state = 3), r.remove();
            }, i.exitDuration);
        }
        fadeOutAll() {
          this._activeRipples.forEach((t) => t.fadeOut());
        }
        fadeOutAllNonPersistent() {
          this._activeRipples.forEach((t) => {
            t.config.persistent || t.fadeOut();
          });
        }
        setupTriggerEvents(t) {
          const e = gs(t);
          !e ||
            e === this._triggerElement ||
            (this._removeTriggerEvents(),
            (this._triggerElement = e),
            this._registerEvents(rS));
        }
        handleEvent(t) {
          "mousedown" === t.type
            ? this._onMousedown(t)
            : "touchstart" === t.type
              ? this._onTouchStart(t)
              : this._onPointerUp(),
            this._pointerUpEventsRegistered ||
              (this._registerEvents(iS),
              (this._pointerUpEventsRegistered = !0));
        }
        _onMousedown(t) {
          const e = Tp(t),
            r =
              this._lastTouchStartEvent &&
              Date.now() < this._lastTouchStartEvent + 800;
          !this._target.rippleDisabled &&
            !e &&
            !r &&
            ((this._isPointerDown = !0),
            this.fadeInRipple(t.clientX, t.clientY, this._target.rippleConfig));
        }
        _onTouchStart(t) {
          if (!this._target.rippleDisabled && !Ip(t)) {
            (this._lastTouchStartEvent = Date.now()),
              (this._isPointerDown = !0);
            const e = t.changedTouches;
            for (let r = 0; r < e.length; r++)
              this.fadeInRipple(
                e[r].clientX,
                e[r].clientY,
                this._target.rippleConfig,
              );
          }
        }
        _onPointerUp() {
          !this._isPointerDown ||
            ((this._isPointerDown = !1),
            this._activeRipples.forEach((t) => {
              !t.config.persistent &&
                (1 === t.state ||
                  (t.config.terminateOnPointerUp && 0 === t.state)) &&
                t.fadeOut();
            }));
        }
        _runTimeoutOutsideZone(t, e = 0) {
          this._ngZone.runOutsideAngular(() => setTimeout(t, e));
        }
        _registerEvents(t) {
          this._ngZone.runOutsideAngular(() => {
            t.forEach((e) => {
              this._triggerElement.addEventListener(e, this, xp);
            });
          });
        }
        _removeTriggerEvents() {
          this._triggerElement &&
            (rS.forEach((t) => {
              this._triggerElement.removeEventListener(t, this, xp);
            }),
            this._pointerUpEventsRegistered &&
              iS.forEach((t) => {
                this._triggerElement.removeEventListener(t, this, xp);
              }));
        }
      }
      const E2 = new w("mat-ripple-global-options");
      let Op = (() => {
          class n {
            constructor(e, r, i, s, o) {
              (this._elementRef = e),
                (this._animationMode = o),
                (this.radius = 0),
                (this._disabled = !1),
                (this._isInitialized = !1),
                (this._globalOptions = s || {}),
                (this._rippleRenderer = new C2(this, r, e, i));
            }
            get disabled() {
              return this._disabled;
            }
            set disabled(e) {
              e && this.fadeOutAllNonPersistent(),
                (this._disabled = e),
                this._setupTriggerEventsIfEnabled();
            }
            get trigger() {
              return this._trigger || this._elementRef.nativeElement;
            }
            set trigger(e) {
              (this._trigger = e), this._setupTriggerEventsIfEnabled();
            }
            ngOnInit() {
              (this._isInitialized = !0), this._setupTriggerEventsIfEnabled();
            }
            ngOnDestroy() {
              this._rippleRenderer._removeTriggerEvents();
            }
            fadeOutAll() {
              this._rippleRenderer.fadeOutAll();
            }
            fadeOutAllNonPersistent() {
              this._rippleRenderer.fadeOutAllNonPersistent();
            }
            get rippleConfig() {
              return {
                centered: this.centered,
                radius: this.radius,
                color: this.color,
                animation: {
                  ...this._globalOptions.animation,
                  ...("NoopAnimations" === this._animationMode
                    ? { enterDuration: 0, exitDuration: 0 }
                    : {}),
                  ...this.animation,
                },
                terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
              };
            }
            get rippleDisabled() {
              return this.disabled || !!this._globalOptions.disabled;
            }
            _setupTriggerEventsIfEnabled() {
              !this.disabled &&
                this._isInitialized &&
                this._rippleRenderer.setupTriggerEvents(this.trigger);
            }
            launch(e, r = 0, i) {
              return "number" == typeof e
                ? this._rippleRenderer.fadeInRipple(e, r, {
                    ...this.rippleConfig,
                    ...i,
                  })
                : this._rippleRenderer.fadeInRipple(0, 0, {
                    ...this.rippleConfig,
                    ...e,
                  });
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Ie), _(le), _(Nn), _(E2, 8), _(Io, 8));
            }),
            (n.ɵdir = F({
              type: n,
              selectors: [
                ["", "mat-ripple", ""],
                ["", "matRipple", ""],
              ],
              hostAttrs: [1, "mat-ripple"],
              hostVars: 2,
              hostBindings: function (e, r) {
                2 & e && Jn("mat-ripple-unbounded", r.unbounded);
              },
              inputs: {
                color: ["matRippleColor", "color"],
                unbounded: ["matRippleUnbounded", "unbounded"],
                centered: ["matRippleCentered", "centered"],
                radius: ["matRippleRadius", "radius"],
                animation: ["matRippleAnimation", "animation"],
                disabled: ["matRippleDisabled", "disabled"],
                trigger: ["matRippleTrigger", "trigger"],
              },
              exportAs: ["matRipple"],
            })),
            n
          );
        })(),
        sS = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ imports: [[Ln, wE], Ln] })),
            n
          );
        })();
      function kp(n) {
        return new ye((t) => {
          let e;
          try {
            e = n();
          } catch (i) {
            return void t.error(i);
          }
          return (e ? ze(e) : Rc()).subscribe(t);
        });
      }
      function Fp(...n) {
        return (function S2() {
          return vi(1);
        })()(k(...n));
      }
      function Zo(...n) {
        const t = n[n.length - 1];
        return yi(t) ? (n.pop(), (e) => Fp(n, e, t)) : (e) => Fp(n, e);
      }
      class oS {}
      const sr = "*";
      function Pp(n, t) {
        return { type: 7, name: n, definitions: t, options: {} };
      }
      function Qo(n, t = null) {
        return { type: 4, styles: t, timings: n };
      }
      function aS(n, t = null) {
        return { type: 2, steps: n, options: t };
      }
      function Dn(n) {
        return { type: 6, styles: n, offset: null };
      }
      function Fc(n, t, e) {
        return { type: 0, name: n, styles: t, options: e };
      }
      function Xo(n, t, e = null) {
        return { type: 1, expr: n, animation: t, options: e };
      }
      function lS(n) {
        Promise.resolve().then(n);
      }
      class Jo {
        constructor(t = 0, e = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = t + e);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
            (this._started = !0);
        }
        triggerMicrotask() {
          lS(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(t) {
          this._position = this.totalTime ? t * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(t) {
          const e = "start" == t ? this._onStartFns : this._onDoneFns;
          e.forEach((r) => r()), (e.length = 0);
        }
      }
      class cS {
        constructor(t) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = t);
          let e = 0,
            r = 0,
            i = 0;
          const s = this.players.length;
          0 == s
            ? lS(() => this._onFinish())
            : this.players.forEach((o) => {
                o.onDone(() => {
                  ++e == s && this._onFinish();
                }),
                  o.onDestroy(() => {
                    ++r == s && this._onDestroy();
                  }),
                  o.onStart(() => {
                    ++i == s && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce(
              (o, a) => Math.max(o, a.totalTime),
              0,
            ));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this.players.forEach((t) => t.init());
        }
        onStart(t) {
          this._onStartFns.push(t);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0),
            this._onStartFns.forEach((t) => t()),
            (this._onStartFns = []));
        }
        onDone(t) {
          this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(),
            this._onStart(),
            this.players.forEach((t) => t.play());
        }
        pause() {
          this.players.forEach((t) => t.pause());
        }
        restart() {
          this.players.forEach((t) => t.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach((t) => t.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach((t) => t.destroy()),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach((t) => t.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(t) {
          const e = t * this.totalTime;
          this.players.forEach((r) => {
            const i = r.totalTime ? Math.min(1, e / r.totalTime) : 1;
            r.setPosition(i);
          });
        }
        getPosition() {
          const t = this.players.reduce(
            (e, r) => (null === e || r.totalTime > e.totalTime ? r : e),
            null,
          );
          return null != t ? t.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach((t) => {
            t.beforeDestroy && t.beforeDestroy();
          });
        }
        triggerCallback(t) {
          const e = "start" == t ? this._onStartFns : this._onDoneFns;
          e.forEach((r) => r()), (e.length = 0);
        }
      }
      function A2(n, t) {}
      class Lp {
        constructor() {
          (this.role = "dialog"),
            (this.panelClass = ""),
            (this.hasBackdrop = !0),
            (this.backdropClass = ""),
            (this.disableClose = !1),
            (this.width = ""),
            (this.height = ""),
            (this.maxWidth = "80vw"),
            (this.data = null),
            (this.ariaDescribedBy = null),
            (this.ariaLabelledBy = null),
            (this.ariaLabel = null),
            (this.autoFocus = "first-tabbable"),
            (this.restoreFocus = !0),
            (this.closeOnNavigation = !0);
        }
      }
      const T2 = {
        dialogContainer: Pp("dialogContainer", [
          Fc("void, exit", Dn({ opacity: 0, transform: "scale(0.7)" })),
          Fc("enter", Dn({ transform: "none" })),
          Xo(
            "* => enter",
            Qo(
              "150ms cubic-bezier(0, 0, 0.2, 1)",
              Dn({ transform: "none", opacity: 1 }),
            ),
          ),
          Xo(
            "* => void, * => exit",
            Qo("75ms cubic-bezier(0.4, 0.0, 0.2, 1)", Dn({ opacity: 0 })),
          ),
        ]),
      };
      let I2 = (() => {
          class n extends Cp {
            constructor(e, r, i, s, o, a, l, c) {
              super(),
                (this._elementRef = e),
                (this._focusTrapFactory = r),
                (this._changeDetectorRef = i),
                (this._config = o),
                (this._interactivityChecker = a),
                (this._ngZone = l),
                (this._focusMonitor = c),
                (this._animationStateChanged = new ae()),
                (this._elementFocusedBeforeDialogWasOpened = null),
                (this._closeInteractionType = null),
                (this.attachDomPortal = (u) => (
                  this._portalOutlet.hasAttached(),
                  this._portalOutlet.attachDomPortal(u)
                )),
                (this._ariaLabelledBy = o.ariaLabelledBy || null),
                (this._document = s);
            }
            _initializeWithAttachedContent() {
              this._setupFocusTrap(), this._capturePreviouslyFocusedElement();
            }
            attachComponentPortal(e) {
              return (
                this._portalOutlet.hasAttached(),
                this._portalOutlet.attachComponentPortal(e)
              );
            }
            attachTemplatePortal(e) {
              return (
                this._portalOutlet.hasAttached(),
                this._portalOutlet.attachTemplatePortal(e)
              );
            }
            _recaptureFocus() {
              this._containsFocus() || this._trapFocus();
            }
            _forceFocus(e, r) {
              this._interactivityChecker.isFocusable(e) ||
                ((e.tabIndex = -1),
                this._ngZone.runOutsideAngular(() => {
                  e.addEventListener("blur", () =>
                    e.removeAttribute("tabindex"),
                  ),
                    e.addEventListener("mousedown", () =>
                      e.removeAttribute("tabindex"),
                    );
                })),
                e.focus(r);
            }
            _focusByCssSelector(e, r) {
              let i = this._elementRef.nativeElement.querySelector(e);
              i && this._forceFocus(i, r);
            }
            _trapFocus() {
              const e = this._elementRef.nativeElement;
              switch (this._config.autoFocus) {
                case !1:
                case "dialog":
                  this._containsFocus() || e.focus();
                  break;
                case !0:
                case "first-tabbable":
                  this._focusTrap.focusInitialElementWhenReady().then((r) => {
                    r || this._focusDialogContainer();
                  });
                  break;
                case "first-heading":
                  this._focusByCssSelector(
                    'h1, h2, h3, h4, h5, h6, [role="heading"]',
                  );
                  break;
                default:
                  this._focusByCssSelector(this._config.autoFocus);
              }
            }
            _restoreFocus() {
              const e = this._elementFocusedBeforeDialogWasOpened;
              if (
                this._config.restoreFocus &&
                e &&
                "function" == typeof e.focus
              ) {
                const r = gp(),
                  i = this._elementRef.nativeElement;
                (!r || r === this._document.body || r === i || i.contains(r)) &&
                  (this._focusMonitor
                    ? (this._focusMonitor.focusVia(
                        e,
                        this._closeInteractionType,
                      ),
                      (this._closeInteractionType = null))
                    : e.focus());
              }
              this._focusTrap && this._focusTrap.destroy();
            }
            _setupFocusTrap() {
              this._focusTrap = this._focusTrapFactory.create(
                this._elementRef.nativeElement,
              );
            }
            _capturePreviouslyFocusedElement() {
              this._document &&
                (this._elementFocusedBeforeDialogWasOpened = gp());
            }
            _focusDialogContainer() {
              this._elementRef.nativeElement.focus &&
                this._elementRef.nativeElement.focus();
            }
            _containsFocus() {
              const e = this._elementRef.nativeElement,
                r = gp();
              return e === r || e.contains(r);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                _(Ie),
                _(c2),
                _(cs),
                _(Y, 8),
                _(Lp),
                _(GE),
                _(le),
                _(kc),
              );
            }),
            (n.ɵdir = F({
              type: n,
              viewQuery: function (e, r) {
                if ((1 & e && Mo(AE, 7), 2 & e)) {
                  let i;
                  xn((i = On())) && (r._portalOutlet = i.first);
                }
              },
              features: [ne],
            })),
            n
          );
        })(),
        R2 = (() => {
          class n extends I2 {
            constructor() {
              super(...arguments), (this._state = "enter");
            }
            _onAnimationDone({ toState: e, totalTime: r }) {
              "enter" === e
                ? (this._trapFocus(),
                  this._animationStateChanged.next({
                    state: "opened",
                    totalTime: r,
                  }))
                : "exit" === e &&
                  (this._restoreFocus(),
                  this._animationStateChanged.next({
                    state: "closed",
                    totalTime: r,
                  }));
            }
            _onAnimationStart({ toState: e, totalTime: r }) {
              "enter" === e
                ? this._animationStateChanged.next({
                    state: "opening",
                    totalTime: r,
                  })
                : ("exit" === e || "void" === e) &&
                  this._animationStateChanged.next({
                    state: "closing",
                    totalTime: r,
                  });
            }
            _startExitAnimation() {
              (this._state = "exit"), this._changeDetectorRef.markForCheck();
            }
          }
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = We(n)))(r || n);
              };
            })()),
            (n.ɵcmp = Ot({
              type: n,
              selectors: [["mat-dialog-container"]],
              hostAttrs: [
                "tabindex",
                "-1",
                "aria-modal",
                "true",
                1,
                "mat-dialog-container",
              ],
              hostVars: 6,
              hostBindings: function (e, r) {
                1 & e &&
                  Ih("@dialogContainer.start", function (s) {
                    return r._onAnimationStart(s);
                  })("@dialogContainer.done", function (s) {
                    return r._onAnimationDone(s);
                  }),
                  2 & e &&
                    (Oh("id", r._id),
                    et("role", r._config.role)(
                      "aria-labelledby",
                      r._config.ariaLabel ? null : r._ariaLabelledBy,
                    )("aria-label", r._config.ariaLabel)(
                      "aria-describedby",
                      r._config.ariaDescribedBy || null,
                    ),
                    kh("@dialogContainer", r._state));
              },
              features: [ne],
              decls: 1,
              vars: 0,
              consts: [["cdkPortalOutlet", ""]],
              template: function (e, r) {
                1 & e && Xe(0, A2, 0, 0, "ng-template", 0);
              },
              dependencies: [AE],
              styles: [
                ".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n",
              ],
              encapsulation: 2,
              data: { animation: [T2.dialogContainer] },
            })),
            n
          );
        })(),
        x2 = 0;
      class uS {
        constructor(t, e, r = "mat-dialog-" + x2++) {
          (this._overlayRef = t),
            (this._containerInstance = e),
            (this.id = r),
            (this.disableClose = this._containerInstance._config.disableClose),
            (this._afterOpened = new de()),
            (this._afterClosed = new de()),
            (this._beforeClosed = new de()),
            (this._state = 0),
            (e._id = r),
            e._animationStateChanged
              .pipe(
                Ze((i) => "opened" === i.state),
                Tt(1),
              )
              .subscribe(() => {
                this._afterOpened.next(), this._afterOpened.complete();
              }),
            e._animationStateChanged
              .pipe(
                Ze((i) => "closed" === i.state),
                Tt(1),
              )
              .subscribe(() => {
                clearTimeout(this._closeFallbackTimeout),
                  this._finishDialogClose();
              }),
            t.detachments().subscribe(() => {
              this._beforeClosed.next(this._result),
                this._beforeClosed.complete(),
                this._afterClosed.next(this._result),
                this._afterClosed.complete(),
                (this.componentInstance = null),
                this._overlayRef.dispose();
            }),
            t
              .keydownEvents()
              .pipe(Ze((i) => 27 === i.keyCode && !this.disableClose && !Ap(i)))
              .subscribe((i) => {
                i.preventDefault(), dS(this, "keyboard");
              }),
            t.backdropClick().subscribe(() => {
              this.disableClose
                ? this._containerInstance._recaptureFocus()
                : dS(this, "mouse");
            });
        }
        close(t) {
          (this._result = t),
            this._containerInstance._animationStateChanged
              .pipe(
                Ze((e) => "closing" === e.state),
                Tt(1),
              )
              .subscribe((e) => {
                this._beforeClosed.next(t),
                  this._beforeClosed.complete(),
                  this._overlayRef.detachBackdrop(),
                  (this._closeFallbackTimeout = setTimeout(
                    () => this._finishDialogClose(),
                    e.totalTime + 100,
                  ));
              }),
            (this._state = 1),
            this._containerInstance._startExitAnimation();
        }
        afterOpened() {
          return this._afterOpened;
        }
        afterClosed() {
          return this._afterClosed;
        }
        beforeClosed() {
          return this._beforeClosed;
        }
        backdropClick() {
          return this._overlayRef.backdropClick();
        }
        keydownEvents() {
          return this._overlayRef.keydownEvents();
        }
        updatePosition(t) {
          let e = this._getPositionStrategy();
          return (
            t && (t.left || t.right)
              ? t.left
                ? e.left(t.left)
                : e.right(t.right)
              : e.centerHorizontally(),
            t && (t.top || t.bottom)
              ? t.top
                ? e.top(t.top)
                : e.bottom(t.bottom)
              : e.centerVertically(),
            this._overlayRef.updatePosition(),
            this
          );
        }
        updateSize(t = "", e = "") {
          return (
            this._overlayRef.updateSize({ width: t, height: e }),
            this._overlayRef.updatePosition(),
            this
          );
        }
        addPanelClass(t) {
          return this._overlayRef.addPanelClass(t), this;
        }
        removePanelClass(t) {
          return this._overlayRef.removePanelClass(t), this;
        }
        getState() {
          return this._state;
        }
        _finishDialogClose() {
          (this._state = 2), this._overlayRef.dispose();
        }
        _getPositionStrategy() {
          return this._overlayRef.getConfig().positionStrategy;
        }
      }
      function dS(n, t, e) {
        return (
          void 0 !== n._containerInstance &&
            (n._containerInstance._closeInteractionType = t),
          n.close(e)
        );
      }
      const O2 = new w("MatDialogData"),
        k2 = new w("mat-dialog-default-options"),
        hS = new w("mat-dialog-scroll-strategy"),
        P2 = {
          provide: hS,
          deps: [ys],
          useFactory: function F2(n) {
            return () => n.scrollStrategies.block();
          },
        };
      let N2 = (() => {
          class n {
            constructor(e, r, i, s, o, a, l, c, u, d) {
              (this._overlay = e),
                (this._injector = r),
                (this._defaultOptions = i),
                (this._parentDialog = s),
                (this._overlayContainer = o),
                (this._dialogRefConstructor = l),
                (this._dialogContainerType = c),
                (this._dialogDataToken = u),
                (this._animationMode = d),
                (this._openDialogsAtThisLevel = []),
                (this._afterAllClosedAtThisLevel = new de()),
                (this._afterOpenedAtThisLevel = new de()),
                (this._ariaHiddenElements = new Map()),
                (this._dialogAnimatingOpen = !1),
                (this.afterAllClosed = kp(() =>
                  this.openDialogs.length
                    ? this._getAfterAllClosed()
                    : this._getAfterAllClosed().pipe(Zo(void 0)),
                )),
                (this._scrollStrategy = a);
            }
            get openDialogs() {
              return this._parentDialog
                ? this._parentDialog.openDialogs
                : this._openDialogsAtThisLevel;
            }
            get afterOpened() {
              return this._parentDialog
                ? this._parentDialog.afterOpened
                : this._afterOpenedAtThisLevel;
            }
            _getAfterAllClosed() {
              const e = this._parentDialog;
              return e
                ? e._getAfterAllClosed()
                : this._afterAllClosedAtThisLevel;
            }
            open(e, r) {
              if (
                ((r = (function L2(n, t) {
                  return { ...t, ...n };
                })(r, this._defaultOptions || new Lp())),
                r.id && this.getDialogById(r.id),
                this._dialogAnimatingOpen)
              )
                return this._lastDialogRef;
              const i = this._createOverlay(r),
                s = this._attachDialogContainer(i, r);
              if ("NoopAnimations" !== this._animationMode) {
                const a = s._animationStateChanged.subscribe((l) => {
                  "opening" === l.state && (this._dialogAnimatingOpen = !0),
                    "opened" === l.state &&
                      ((this._dialogAnimatingOpen = !1), a.unsubscribe());
                });
                this._animationStateSubscriptions ||
                  (this._animationStateSubscriptions = new ue()),
                  this._animationStateSubscriptions.add(a);
              }
              const o = this._attachDialogContent(e, s, i, r);
              return (
                (this._lastDialogRef = o),
                this.openDialogs.length ||
                  this._hideNonDialogContentFromAssistiveTechnology(),
                this.openDialogs.push(o),
                o.afterClosed().subscribe(() => this._removeOpenDialog(o)),
                this.afterOpened.next(o),
                s._initializeWithAttachedContent(),
                o
              );
            }
            closeAll() {
              this._closeDialogs(this.openDialogs);
            }
            getDialogById(e) {
              return this.openDialogs.find((r) => r.id === e);
            }
            ngOnDestroy() {
              this._closeDialogs(this._openDialogsAtThisLevel),
                this._afterAllClosedAtThisLevel.complete(),
                this._afterOpenedAtThisLevel.complete(),
                this._animationStateSubscriptions &&
                  this._animationStateSubscriptions.unsubscribe();
            }
            _createOverlay(e) {
              const r = this._getOverlayConfig(e);
              return this._overlay.create(r);
            }
            _getOverlayConfig(e) {
              const r = new wp({
                positionStrategy: this._overlay.position().global(),
                scrollStrategy: e.scrollStrategy || this._scrollStrategy(),
                panelClass: e.panelClass,
                hasBackdrop: e.hasBackdrop,
                direction: e.direction,
                minWidth: e.minWidth,
                minHeight: e.minHeight,
                maxWidth: e.maxWidth,
                maxHeight: e.maxHeight,
                disposeOnNavigation: e.closeOnNavigation,
              });
              return e.backdropClass && (r.backdropClass = e.backdropClass), r;
            }
            _attachDialogContainer(e, r) {
              const s = Ne.create({
                  parent:
                    (r && r.viewContainerRef && r.viewContainerRef.injector) ||
                    this._injector,
                  providers: [{ provide: Lp, useValue: r }],
                }),
                o = new vp(
                  this._dialogContainerType,
                  r.viewContainerRef,
                  s,
                  r.componentFactoryResolver,
                );
              return e.attach(o).instance;
            }
            _attachDialogContent(e, r, i, s) {
              const o = new this._dialogRefConstructor(i, r, s.id);
              if (e instanceof _n)
                r.attachTemplatePortal(
                  new bp(e, null, { $implicit: s.data, dialogRef: o }),
                );
              else {
                const a = this._createInjector(s, o, r),
                  l = r.attachComponentPortal(new vp(e, s.viewContainerRef, a));
                o.componentInstance = l.instance;
              }
              return (
                o.updateSize(s.width, s.height).updatePosition(s.position), o
              );
            }
            _createInjector(e, r, i) {
              const s = e && e.viewContainerRef && e.viewContainerRef.injector,
                o = [
                  { provide: this._dialogContainerType, useValue: i },
                  { provide: this._dialogDataToken, useValue: e.data },
                  { provide: this._dialogRefConstructor, useValue: r },
                ];
              return (
                e.direction &&
                  (!s || !s.get(Ic, null, P.Optional)) &&
                  o.push({
                    provide: Ic,
                    useValue: { value: e.direction, change: k() },
                  }),
                Ne.create({ parent: s || this._injector, providers: o })
              );
            }
            _removeOpenDialog(e) {
              const r = this.openDialogs.indexOf(e);
              r > -1 &&
                (this.openDialogs.splice(r, 1),
                this.openDialogs.length ||
                  (this._ariaHiddenElements.forEach((i, s) => {
                    i
                      ? s.setAttribute("aria-hidden", i)
                      : s.removeAttribute("aria-hidden");
                  }),
                  this._ariaHiddenElements.clear(),
                  this._getAfterAllClosed().next()));
            }
            _hideNonDialogContentFromAssistiveTechnology() {
              const e = this._overlayContainer.getContainerElement();
              if (e.parentElement) {
                const r = e.parentElement.children;
                for (let i = r.length - 1; i > -1; i--) {
                  let s = r[i];
                  s !== e &&
                    "SCRIPT" !== s.nodeName &&
                    "STYLE" !== s.nodeName &&
                    !s.hasAttribute("aria-live") &&
                    (this._ariaHiddenElements.set(
                      s,
                      s.getAttribute("aria-hidden"),
                    ),
                    s.setAttribute("aria-hidden", "true"));
                }
              }
            }
            _closeDialogs(e) {
              let r = e.length;
              for (; r--; ) e[r].close();
            }
          }
          return (
            (n.ɵfac = function (e) {
              fl();
            }),
            (n.ɵdir = F({ type: n })),
            n
          );
        })(),
        fS = (() => {
          class n extends N2 {
            constructor(e, r, i, s, o, a, l, c) {
              super(e, r, s, a, l, o, uS, R2, O2, c);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                m(ys),
                m(Ne),
                m(xo, 8),
                m(k2, 8),
                m(hS),
                m(n, 12),
                m(Ep),
                m(Io, 8),
              );
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        V2 = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ providers: [fS, P2], imports: [[VE, TE, Ln], Ln] })),
            n
          );
        })();
      const Pc = (() => {
        function n() {
          return (
            Error.call(this),
            (this.message = "no elements in sequence"),
            (this.name = "EmptyError"),
            this
          );
        }
        return (n.prototype = Object.create(Error.prototype)), n;
      })();
      class pS extends ge {
        notifyNext(t, e, r, i, s) {
          this.destination.next(e);
        }
        notifyError(t, e) {
          this.destination.error(t);
        }
        notifyComplete(t) {
          this.destination.complete();
        }
      }
      class B2 extends ge {
        constructor(t, e, r) {
          super(),
            (this.parent = t),
            (this.outerValue = e),
            (this.outerIndex = r),
            (this.index = 0);
        }
        _next(t) {
          this.parent.notifyNext(
            this.outerValue,
            t,
            this.outerIndex,
            this.index++,
            this,
          );
        }
        _error(t) {
          this.parent.notifyError(t, this), this.unsubscribe();
        }
        _complete() {
          this.parent.notifyComplete(this), this.unsubscribe();
        }
      }
      function gS(n, t, e, r, i = new B2(n, e, r)) {
        if (!i.closed) return t instanceof ye ? t.subscribe(i) : xu(t)(i);
      }
      const mS = {};
      function _S(...n) {
        let t, e;
        return (
          yi(n[n.length - 1]) && (e = n.pop()),
          "function" == typeof n[n.length - 1] && (t = n.pop()),
          1 === n.length && mi(n[0]) && (n = n[0]),
          ku(n, e).lift(new j2(t))
        );
      }
      class j2 {
        constructor(t) {
          this.resultSelector = t;
        }
        call(t, e) {
          return e.subscribe(new U2(t, this.resultSelector));
        }
      }
      class U2 extends pS {
        constructor(t, e) {
          super(t),
            (this.resultSelector = e),
            (this.active = 0),
            (this.values = []),
            (this.observables = []);
        }
        _next(t) {
          this.values.push(mS), this.observables.push(t);
        }
        _complete() {
          const t = this.observables,
            e = t.length;
          if (0 === e) this.destination.complete();
          else {
            (this.active = e), (this.toRespond = e);
            for (let r = 0; r < e; r++) this.add(gS(this, t[r], void 0, r));
          }
        }
        notifyComplete(t) {
          0 == (this.active -= 1) && this.destination.complete();
        }
        notifyNext(t, e, r) {
          const i = this.values,
            o = this.toRespond
              ? i[r] === mS
                ? --this.toRespond
                : this.toRespond
              : 0;
          (i[r] = e),
            0 === o &&
              (this.resultSelector
                ? this._tryResultSelector(i)
                : this.destination.next(i.slice()));
        }
        _tryResultSelector(t) {
          let e;
          try {
            e = this.resultSelector.apply(this, t);
          } catch (r) {
            return void this.destination.error(r);
          }
          this.destination.next(e);
        }
      }
      function ii(n, t) {
        return new ye(
          t
            ? (e) => t.schedule(H2, 0, { error: n, subscriber: e })
            : (e) => e.error(n),
        );
      }
      function H2({ error: n, subscriber: t }) {
        t.error(n);
      }
      function Ht(n, t) {
        return "function" == typeof t
          ? (e) =>
              e.pipe(Ht((r, i) => ze(n(r, i)).pipe(U((s, o) => t(r, s, i, o)))))
          : (e) => e.lift(new $2(n));
      }
      class $2 {
        constructor(t) {
          this.project = t;
        }
        call(t, e) {
          return e.subscribe(new z2(t, this.project));
        }
      }
      class z2 extends Fs {
        constructor(t, e) {
          super(t), (this.project = e), (this.index = 0);
        }
        _next(t) {
          let e;
          const r = this.index++;
          try {
            e = this.project(t, r);
          } catch (i) {
            return void this.destination.error(i);
          }
          this._innerSub(e);
        }
        _innerSub(t) {
          const e = this.innerSubscription;
          e && e.unsubscribe();
          const r = new ks(this),
            i = this.destination;
          i.add(r),
            (this.innerSubscription = Ps(t, r)),
            this.innerSubscription !== r && i.add(this.innerSubscription);
        }
        _complete() {
          const { innerSubscription: t } = this;
          (!t || t.closed) && super._complete(), this.unsubscribe();
        }
        _unsubscribe() {
          this.innerSubscription = void 0;
        }
        notifyComplete() {
          (this.innerSubscription = void 0),
            this.isStopped && super._complete();
        }
        notifyNext(t) {
          this.destination.next(t);
        }
      }
      function Nc(n = null) {
        return (t) => t.lift(new G2(n));
      }
      class G2 {
        constructor(t) {
          this.defaultValue = t;
        }
        call(t, e) {
          return e.subscribe(new W2(t, this.defaultValue));
        }
      }
      class W2 extends ge {
        constructor(t, e) {
          super(t), (this.defaultValue = e), (this.isEmpty = !0);
        }
        _next(t) {
          (this.isEmpty = !1), this.destination.next(t);
        }
        _complete() {
          this.isEmpty && this.destination.next(this.defaultValue),
            this.destination.complete();
        }
      }
      function yS(n = Y2) {
        return (t) => t.lift(new q2(n));
      }
      class q2 {
        constructor(t) {
          this.errorFactory = t;
        }
        call(t, e) {
          return e.subscribe(new K2(t, this.errorFactory));
        }
      }
      class K2 extends ge {
        constructor(t, e) {
          super(t), (this.errorFactory = e), (this.hasValue = !1);
        }
        _next(t) {
          (this.hasValue = !0), this.destination.next(t);
        }
        _complete() {
          if (this.hasValue) return this.destination.complete();
          {
            let t;
            try {
              t = this.errorFactory();
            } catch (e) {
              t = e;
            }
            this.destination.error(t);
          }
        }
      }
      function Y2() {
        return new Pc();
      }
      function Ir(n, t) {
        const e = arguments.length >= 2;
        return (r) =>
          r.pipe(
            n ? Ze((i, s) => n(i, s, r)) : Ta,
            Tt(1),
            e ? Nc(t) : yS(() => new Pc()),
          );
      }
      function Rr(n) {
        return function (e) {
          const r = new Z2(n),
            i = e.lift(r);
          return (r.caught = i);
        };
      }
      class Z2 {
        constructor(t) {
          this.selector = t;
        }
        call(t, e) {
          return e.subscribe(new Q2(t, this.selector, this.caught));
        }
      }
      class Q2 extends Fs {
        constructor(t, e, r) {
          super(t), (this.selector = e), (this.caught = r);
        }
        error(t) {
          if (!this.isStopped) {
            let e;
            try {
              e = this.selector(t, this.caught);
            } catch (s) {
              return void super.error(s);
            }
            this._unsubscribeAndRecycle();
            const r = new ks(this);
            this.add(r);
            const i = Ps(e, r);
            i !== r && this.add(i);
          }
        }
      }
      function Vp(n, t) {
        let e = !1;
        return (
          arguments.length >= 2 && (e = !0),
          function (i) {
            return i.lift(new X2(n, t, e));
          }
        );
      }
      class X2 {
        constructor(t, e, r = !1) {
          (this.accumulator = t), (this.seed = e), (this.hasSeed = r);
        }
        call(t, e) {
          return e.subscribe(
            new J2(t, this.accumulator, this.seed, this.hasSeed),
          );
        }
      }
      class J2 extends ge {
        constructor(t, e, r, i) {
          super(t),
            (this.accumulator = e),
            (this._seed = r),
            (this.hasSeed = i),
            (this.index = 0);
        }
        get seed() {
          return this._seed;
        }
        set seed(t) {
          (this.hasSeed = !0), (this._seed = t);
        }
        _next(t) {
          if (this.hasSeed) return this._tryNext(t);
          (this.seed = t), this.destination.next(t);
        }
        _tryNext(t) {
          const e = this.index++;
          let r;
          try {
            r = this.accumulator(this.seed, t, e);
          } catch (i) {
            this.destination.error(i);
          }
          (this.seed = r), this.destination.next(r);
        }
      }
      function Bp(n) {
        return function (e) {
          return 0 === n ? Rc() : e.lift(new ej(n));
        };
      }
      class ej {
        constructor(t) {
          if (((this.total = t), this.total < 0)) throw new IE();
        }
        call(t, e) {
          return e.subscribe(new tj(t, this.total));
        }
      }
      class tj extends ge {
        constructor(t, e) {
          super(t),
            (this.total = e),
            (this.ring = new Array()),
            (this.count = 0);
        }
        _next(t) {
          const e = this.ring,
            r = this.total,
            i = this.count++;
          e.length < r ? e.push(t) : (e[i % r] = t);
        }
        _complete() {
          const t = this.destination;
          let e = this.count;
          if (e > 0) {
            const r = this.count >= this.total ? this.total : this.count,
              i = this.ring;
            for (let s = 0; s < r; s++) {
              const o = e++ % r;
              t.next(i[o]);
            }
          }
          t.complete();
        }
      }
      function vS(n, t) {
        const e = arguments.length >= 2;
        return (r) =>
          r.pipe(
            n ? Ze((i, s) => n(i, s, r)) : Ta,
            Bp(1),
            e ? Nc(t) : yS(() => new Pc()),
          );
      }
      class rj {
        constructor(t, e) {
          (this.predicate = t), (this.inclusive = e);
        }
        call(t, e) {
          return e.subscribe(new ij(t, this.predicate, this.inclusive));
        }
      }
      class ij extends ge {
        constructor(t, e, r) {
          super(t),
            (this.predicate = e),
            (this.inclusive = r),
            (this.index = 0);
        }
        _next(t) {
          const e = this.destination;
          let r;
          try {
            r = this.predicate(t, this.index++);
          } catch (i) {
            return void e.error(i);
          }
          this.nextOrComplete(t, r);
        }
        nextOrComplete(t, e) {
          const r = this.destination;
          Boolean(e) ? r.next(t) : (this.inclusive && r.next(t), r.complete());
        }
      }
      class oj {
        constructor(t) {
          this.value = t;
        }
        call(t, e) {
          return e.subscribe(new aj(t, this.value));
        }
      }
      class aj extends ge {
        constructor(t, e) {
          super(t), (this.value = e);
        }
        _next(t) {
          this.destination.next(this.value);
        }
      }
      function Lc(n) {
        return (t) => t.lift(new lj(n));
      }
      class lj {
        constructor(t) {
          this.callback = t;
        }
        call(t, e) {
          return e.subscribe(new cj(t, this.callback));
        }
      }
      class cj extends ge {
        constructor(t, e) {
          super(t), this.add(new ue(e));
        }
      }
      const J = "primary",
        ea = Symbol("RouteTitle");
      class uj {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const e = this.params[t];
            return Array.isArray(e) ? e[0] : e;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const e = this.params[t];
            return Array.isArray(e) ? e : [e];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function bs(n) {
        return new uj(n);
      }
      function dj(n, t, e) {
        const r = e.path.split("/");
        if (
          r.length > n.length ||
          ("full" === e.pathMatch && (t.hasChildren() || r.length < n.length))
        )
          return null;
        const i = {};
        for (let s = 0; s < r.length; s++) {
          const o = r[s],
            a = n[s];
          if (o.startsWith(":")) i[o.substring(1)] = a;
          else if (o !== a.path) return null;
        }
        return { consumed: n.slice(0, r.length), posParams: i };
      }
      function Vn(n, t) {
        const e = n ? Object.keys(n) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!e || !r || e.length != r.length) return !1;
        let i;
        for (let s = 0; s < e.length; s++)
          if (((i = e[s]), !bS(n[i], t[i]))) return !1;
        return !0;
      }
      function bS(n, t) {
        if (Array.isArray(n) && Array.isArray(t)) {
          if (n.length !== t.length) return !1;
          const e = [...n].sort(),
            r = [...t].sort();
          return e.every((i, s) => r[s] === i);
        }
        return n === t;
      }
      function CS(n) {
        return Array.prototype.concat.apply([], n);
      }
      function DS(n) {
        return n.length > 0 ? n[n.length - 1] : null;
      }
      function rt(n, t) {
        for (const e in n) n.hasOwnProperty(e) && t(n[e], e);
      }
      function xr(n) {
        return Th(n) ? n : go(n) ? ze(Promise.resolve(n)) : k(n);
      }
      const pj = {
          exact: function SS(n, t, e) {
            if (
              !oi(n.segments, t.segments) ||
              !Vc(n.segments, t.segments, e) ||
              n.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!n.children[r] || !SS(n.children[r], t.children[r], e))
                return !1;
            return !0;
          },
          subset: MS,
        },
        wS = {
          exact: function gj(n, t) {
            return Vn(n, t);
          },
          subset: function mj(n, t) {
            return (
              Object.keys(t).length <= Object.keys(n).length &&
              Object.keys(t).every((e) => bS(n[e], t[e]))
            );
          },
          ignored: () => !0,
        };
      function ES(n, t, e) {
        return (
          pj[e.paths](n.root, t.root, e.matrixParams) &&
          wS[e.queryParams](n.queryParams, t.queryParams) &&
          !("exact" === e.fragment && n.fragment !== t.fragment)
        );
      }
      function MS(n, t, e) {
        return AS(n, t, t.segments, e);
      }
      function AS(n, t, e, r) {
        if (n.segments.length > e.length) {
          const i = n.segments.slice(0, e.length);
          return !(!oi(i, e) || t.hasChildren() || !Vc(i, e, r));
        }
        if (n.segments.length === e.length) {
          if (!oi(n.segments, e) || !Vc(n.segments, e, r)) return !1;
          for (const i in t.children)
            if (!n.children[i] || !MS(n.children[i], t.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = e.slice(0, n.segments.length),
            s = e.slice(n.segments.length);
          return (
            !!(oi(n.segments, i) && Vc(n.segments, i, r) && n.children[J]) &&
            AS(n.children[J], t, s, r)
          );
        }
      }
      function Vc(n, t, e) {
        return t.every((r, i) => wS[e](n[i].parameters, r.parameters));
      }
      class si {
        constructor(t, e, r) {
          (this.root = t), (this.queryParams = e), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = bs(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return vj.serialize(this);
        }
      }
      class ee {
        constructor(t, e) {
          (this.segments = t),
            (this.children = e),
            (this.parent = null),
            rt(e, (r, i) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Bc(this);
        }
      }
      class ta {
        constructor(t, e) {
          (this.path = t), (this.parameters = e);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = bs(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return xS(this);
        }
      }
      function oi(n, t) {
        return n.length === t.length && n.every((e, r) => e.path === t[r].path);
      }
      let TS = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({
            token: n,
            factory: function () {
              return new Up();
            },
            providedIn: "root",
          })),
          n
        );
      })();
      class Up {
        parse(t) {
          const e = new Tj(t);
          return new si(
            e.parseRootSegment(),
            e.parseQueryParams(),
            e.parseFragment(),
          );
        }
        serialize(t) {
          const e = `/${na(t.root, !0)}`,
            r = (function Dj(n) {
              const t = Object.keys(n)
                .map((e) => {
                  const r = n[e];
                  return Array.isArray(r)
                    ? r.map((i) => `${jc(e)}=${jc(i)}`).join("&")
                    : `${jc(e)}=${jc(r)}`;
                })
                .filter((e) => !!e);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams),
            i =
              "string" == typeof t.fragment
                ? `#${(function bj(n) {
                    return encodeURI(n);
                  })(t.fragment)}`
                : "";
          return `${e}${r}${i}`;
        }
      }
      const vj = new Up();
      function Bc(n) {
        return n.segments.map((t) => xS(t)).join("/");
      }
      function na(n, t) {
        if (!n.hasChildren()) return Bc(n);
        if (t) {
          const e = n.children[J] ? na(n.children[J], !1) : "",
            r = [];
          return (
            rt(n.children, (i, s) => {
              s !== J && r.push(`${s}:${na(i, !1)}`);
            }),
            r.length > 0 ? `${e}(${r.join("//")})` : e
          );
        }
        {
          const e = (function yj(n, t) {
            let e = [];
            return (
              rt(n.children, (r, i) => {
                i === J && (e = e.concat(t(r, i)));
              }),
              rt(n.children, (r, i) => {
                i !== J && (e = e.concat(t(r, i)));
              }),
              e
            );
          })(n, (r, i) =>
            i === J ? [na(n.children[J], !1)] : [`${i}:${na(r, !1)}`],
          );
          return 1 === Object.keys(n.children).length && null != n.children[J]
            ? `${Bc(n)}/${e[0]}`
            : `${Bc(n)}/(${e.join("//")})`;
        }
      }
      function IS(n) {
        return encodeURIComponent(n)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function jc(n) {
        return IS(n).replace(/%3B/gi, ";");
      }
      function Hp(n) {
        return IS(n)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function Uc(n) {
        return decodeURIComponent(n);
      }
      function RS(n) {
        return Uc(n.replace(/\+/g, "%20"));
      }
      function xS(n) {
        return `${Hp(n.path)}${(function Cj(n) {
          return Object.keys(n)
            .map((t) => `;${Hp(t)}=${Hp(n[t])}`)
            .join("");
        })(n.parameters)}`;
      }
      const wj = /^[^\/()?;=#]+/;
      function Hc(n) {
        const t = n.match(wj);
        return t ? t[0] : "";
      }
      const Ej = /^[^=?&#]+/,
        Mj = /^[^&#]+/;
      class Tj {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new ee([], {})
              : new ee([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let e = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (e = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(e).length > 0) &&
              (r[J] = new ee(t, e)),
            r
          );
        }
        parseSegment() {
          const t = Hc(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new C(4009, !1);
          return this.capture(t), new ta(Uc(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const e = Hc(this.remaining);
          if (!e) return;
          this.capture(e);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = Hc(this.remaining);
            i && ((r = i), this.capture(r));
          }
          t[Uc(e)] = Uc(r);
        }
        parseQueryParam(t) {
          const e = (function Sj(n) {
            const t = n.match(Ej);
            return t ? t[0] : "";
          })(this.remaining);
          if (!e) return;
          this.capture(e);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = (function Aj(n) {
              const t = n.match(Mj);
              return t ? t[0] : "";
            })(this.remaining);
            o && ((r = o), this.capture(r));
          }
          const i = RS(e),
            s = RS(r);
          if (t.hasOwnProperty(i)) {
            let o = t[i];
            Array.isArray(o) || ((o = [o]), (t[i] = o)), o.push(s);
          } else t[i] = s;
        }
        parseParens(t) {
          const e = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = Hc(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new C(4010, !1);
            let s;
            r.indexOf(":") > -1
              ? ((s = r.slice(0, r.indexOf(":"))),
                this.capture(s),
                this.capture(":"))
              : t && (s = J);
            const o = this.parseChildren();
            (e[s] = 1 === Object.keys(o).length ? o[J] : new ee([], o)),
              this.consumeOptional("//");
          }
          return e;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new C(4011, !1);
        }
      }
      function $p(n) {
        return n.segments.length > 0 ? new ee([], { [J]: n }) : n;
      }
      function $c(n) {
        const t = {};
        for (const r of Object.keys(n.children)) {
          const s = $c(n.children[r]);
          (s.segments.length > 0 || s.hasChildren()) && (t[r] = s);
        }
        return (function Ij(n) {
          if (1 === n.numberOfChildren && n.children[J]) {
            const t = n.children[J];
            return new ee(n.segments.concat(t.segments), t.children);
          }
          return n;
        })(new ee(n.segments, t));
      }
      function ai(n) {
        return n instanceof si;
      }
      function Oj(n, t, e, r, i) {
        if (0 === e.length) return Cs(t.root, t.root, t.root, r, i);
        const s = (function FS(n) {
          if ("string" == typeof n[0] && 1 === n.length && "/" === n[0])
            return new kS(!0, 0, n);
          let t = 0,
            e = !1;
          const r = n.reduce((i, s, o) => {
            if ("object" == typeof s && null != s) {
              if (s.outlets) {
                const a = {};
                return (
                  rt(s.outlets, (l, c) => {
                    a[c] = "string" == typeof l ? l.split("/") : l;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (s.segmentPath) return [...i, s.segmentPath];
            }
            return "string" != typeof s
              ? [...i, s]
              : 0 === o
                ? (s.split("/").forEach((a, l) => {
                    (0 == l && "." === a) ||
                      (0 == l && "" === a
                        ? (e = !0)
                        : ".." === a
                          ? t++
                          : "" != a && i.push(a));
                  }),
                  i)
                : [...i, s];
          }, []);
          return new kS(e, t, r);
        })(e);
        return s.toRoot()
          ? Cs(t.root, t.root, new ee([], {}), r, i)
          : (function o(l) {
              const c = (function Fj(n, t, e, r) {
                  if (n.isAbsolute) return new Ds(t.root, !0, 0);
                  if (-1 === r) return new Ds(e, e === t.root, 0);
                  return (function PS(n, t, e) {
                    let r = n,
                      i = t,
                      s = e;
                    for (; s > i; ) {
                      if (((s -= i), (r = r.parent), !r)) throw new C(4005, !1);
                      i = r.segments.length;
                    }
                    return new Ds(r, !1, i - s);
                  })(e, r + (ra(n.commands[0]) ? 0 : 1), n.numberOfDoubleDots);
                })(s, t, n.snapshot?._urlSegment, l),
                u = c.processChildren
                  ? sa(c.segmentGroup, c.index, s.commands)
                  : Gp(c.segmentGroup, c.index, s.commands);
              return Cs(t.root, c.segmentGroup, u, r, i);
            })(n.snapshot?._lastPathIndex);
      }
      function ra(n) {
        return (
          "object" == typeof n && null != n && !n.outlets && !n.segmentPath
        );
      }
      function ia(n) {
        return "object" == typeof n && null != n && n.outlets;
      }
      function Cs(n, t, e, r, i) {
        let o,
          s = {};
        r &&
          rt(r, (l, c) => {
            s[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
          }),
          (o = n === t ? e : OS(n, t, e));
        const a = $p($c(o));
        return new si(a, s, i);
      }
      function OS(n, t, e) {
        const r = {};
        return (
          rt(n.children, (i, s) => {
            r[s] = i === t ? e : OS(i, t, e);
          }),
          new ee(n.segments, r)
        );
      }
      class kS {
        constructor(t, e, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = e),
            (this.commands = r),
            t && r.length > 0 && ra(r[0]))
          )
            throw new C(4003, !1);
          const i = r.find(ia);
          if (i && i !== DS(r)) throw new C(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class Ds {
        constructor(t, e, r) {
          (this.segmentGroup = t), (this.processChildren = e), (this.index = r);
        }
      }
      function Gp(n, t, e) {
        if (
          (n || (n = new ee([], {})),
          0 === n.segments.length && n.hasChildren())
        )
          return sa(n, t, e);
        const r = (function Nj(n, t, e) {
            let r = 0,
              i = t;
            const s = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < n.segments.length; ) {
              if (r >= e.length) return s;
              const o = n.segments[i],
                a = e[r];
              if (ia(a)) break;
              const l = `${a}`,
                c = r < e.length - 1 ? e[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && c && "object" == typeof c && void 0 === c.outlets) {
                if (!LS(l, c, o)) return s;
                r += 2;
              } else {
                if (!LS(l, {}, o)) return s;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(n, t, e),
          i = e.slice(r.commandIndex);
        if (r.match && r.pathIndex < n.segments.length) {
          const s = new ee(n.segments.slice(0, r.pathIndex), {});
          return (
            (s.children[J] = new ee(n.segments.slice(r.pathIndex), n.children)),
            sa(s, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new ee(n.segments, {})
          : r.match && !n.hasChildren()
            ? Wp(n, t, e)
            : r.match
              ? sa(n, 0, i)
              : Wp(n, t, e);
      }
      function sa(n, t, e) {
        if (0 === e.length) return new ee(n.segments, {});
        {
          const r = (function Pj(n) {
              return ia(n[0]) ? n[0].outlets : { [J]: n };
            })(e),
            i = {};
          return (
            rt(r, (s, o) => {
              "string" == typeof s && (s = [s]),
                null !== s && (i[o] = Gp(n.children[o], t, s));
            }),
            rt(n.children, (s, o) => {
              void 0 === r[o] && (i[o] = s);
            }),
            new ee(n.segments, i)
          );
        }
      }
      function Wp(n, t, e) {
        const r = n.segments.slice(0, t);
        let i = 0;
        for (; i < e.length; ) {
          const s = e[i];
          if (ia(s)) {
            const l = Lj(s.outlets);
            return new ee(r, l);
          }
          if (0 === i && ra(e[0])) {
            r.push(new ta(n.segments[t].path, NS(e[0]))), i++;
            continue;
          }
          const o = ia(s) ? s.outlets[J] : `${s}`,
            a = i < e.length - 1 ? e[i + 1] : null;
          o && a && ra(a)
            ? (r.push(new ta(o, NS(a))), (i += 2))
            : (r.push(new ta(o, {})), i++);
        }
        return new ee(r, {});
      }
      function Lj(n) {
        const t = {};
        return (
          rt(n, (e, r) => {
            "string" == typeof e && (e = [e]),
              null !== e && (t[r] = Wp(new ee([], {}), 0, e));
          }),
          t
        );
      }
      function NS(n) {
        const t = {};
        return rt(n, (e, r) => (t[r] = `${e}`)), t;
      }
      function LS(n, t, e) {
        return n == e.path && Vn(t, e.parameters);
      }
      class or {
        constructor(t, e) {
          (this.id = t), (this.url = e);
        }
      }
      class qp extends or {
        constructor(t, e, r = "imperative", i = null) {
          super(t, e),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class li extends or {
        constructor(t, e, r) {
          super(t, e), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class zc extends or {
        constructor(t, e, r, i) {
          super(t, e), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class VS extends or {
        constructor(t, e, r, i) {
          super(t, e), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class Vj extends or {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Bj extends or {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class jj extends or {
        constructor(t, e, r, i, s) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = s),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class Uj extends or {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Hj extends or {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class $j {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class zj {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class Gj {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class Wj {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class qj {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class Kj {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class BS {
        constructor(t, e, r) {
          (this.routerEvent = t),
            (this.position = e),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${this.position ? `${this.position[0]}, ${this.position[1]}` : null}')`;
        }
      }
      class jS {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const e = this.pathFromRoot(t);
          return e.length > 1 ? e[e.length - 2] : null;
        }
        children(t) {
          const e = Kp(t, this._root);
          return e ? e.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const e = Kp(t, this._root);
          return e && e.children.length > 0 ? e.children[0].value : null;
        }
        siblings(t) {
          const e = Yp(t, this._root);
          return e.length < 2
            ? []
            : e[e.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== t);
        }
        pathFromRoot(t) {
          return Yp(t, this._root).map((e) => e.value);
        }
      }
      function Kp(n, t) {
        if (n === t.value) return t;
        for (const e of t.children) {
          const r = Kp(n, e);
          if (r) return r;
        }
        return null;
      }
      function Yp(n, t) {
        if (n === t.value) return [t];
        for (const e of t.children) {
          const r = Yp(n, e);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class ar {
        constructor(t, e) {
          (this.value = t), (this.children = e);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function ws(n) {
        const t = {};
        return n && n.children.forEach((e) => (t[e.value.outlet] = e)), t;
      }
      class US extends jS {
        constructor(t, e) {
          super(t), (this.snapshot = e), Zp(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function HS(n, t) {
        const e = (function Zj(n, t) {
            const o = new Gc([], {}, {}, "", {}, J, t, null, n.root, -1, {});
            return new zS("", new ar(o, []));
          })(n, t),
          r = new Ct([new ta("", {})]),
          i = new Ct({}),
          s = new Ct({}),
          o = new Ct({}),
          a = new Ct(""),
          l = new ci(r, i, o, a, s, J, t, e.root);
        return (l.snapshot = e.root), new US(new ar(l, []), e);
      }
      class ci {
        constructor(t, e, r, i, s, o, a, l) {
          (this.url = t),
            (this.params = e),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = s),
            (this.outlet = o),
            (this.component = a),
            (this.title = this.data?.pipe(U((c) => c[ea])) ?? k(void 0)),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(U((t) => bs(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(U((t) => bs(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function $S(n, t = "emptyOnly") {
        const e = n.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = e.length - 1; r >= 1; ) {
            const i = e[r],
              s = e[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (s.component) break;
              r--;
            }
          }
        return (function Qj(n) {
          return n.reduce(
            (t, e) => ({
              params: { ...t.params, ...e.params },
              data: { ...t.data, ...e.data },
              resolve: {
                ...e.data,
                ...t.resolve,
                ...e.routeConfig?.data,
                ...e._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} },
          );
        })(e.slice(r));
      }
      class Gc {
        constructor(t, e, r, i, s, o, a, l, c, u, d, h) {
          (this.url = t),
            (this.params = e),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = s),
            (this.outlet = o),
            (this.component = a),
            (this.title = this.data?.[ea]),
            (this.routeConfig = l),
            (this._urlSegment = c),
            (this._lastPathIndex = u),
            (this._correctedLastPathIndex = h ?? u),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = bs(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = bs(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url.map((r) => r.toString()).join("/")}', path:'${this.routeConfig ? this.routeConfig.path : ""}')`;
        }
      }
      class zS extends jS {
        constructor(t, e) {
          super(e), (this.url = t), Zp(this, e);
        }
        toString() {
          return GS(this._root);
        }
      }
      function Zp(n, t) {
        (t.value._routerState = n), t.children.forEach((e) => Zp(n, e));
      }
      function GS(n) {
        const t =
          n.children.length > 0 ? ` { ${n.children.map(GS).join(", ")} } ` : "";
        return `${n.value}${t}`;
      }
      function Qp(n) {
        if (n.snapshot) {
          const t = n.snapshot,
            e = n._futureSnapshot;
          (n.snapshot = e),
            Vn(t.queryParams, e.queryParams) ||
              n.queryParams.next(e.queryParams),
            t.fragment !== e.fragment && n.fragment.next(e.fragment),
            Vn(t.params, e.params) || n.params.next(e.params),
            (function hj(n, t) {
              if (n.length !== t.length) return !1;
              for (let e = 0; e < n.length; ++e) if (!Vn(n[e], t[e])) return !1;
              return !0;
            })(t.url, e.url) || n.url.next(e.url),
            Vn(t.data, e.data) || n.data.next(e.data);
        } else
          (n.snapshot = n._futureSnapshot), n.data.next(n._futureSnapshot.data);
      }
      function Xp(n, t) {
        const e =
          Vn(n.params, t.params) &&
          (function _j(n, t) {
            return (
              oi(n, t) && n.every((e, r) => Vn(e.parameters, t[r].parameters))
            );
          })(n.url, t.url);
        return (
          e &&
          !(!n.parent != !t.parent) &&
          (!n.parent || Xp(n.parent, t.parent))
        );
      }
      function oa(n, t, e) {
        if (e && n.shouldReuseRoute(t.value, e.value.snapshot)) {
          const r = e.value;
          r._futureSnapshot = t.value;
          const i = (function Jj(n, t, e) {
            return t.children.map((r) => {
              for (const i of e.children)
                if (n.shouldReuseRoute(r.value, i.value.snapshot))
                  return oa(n, r, i);
              return oa(n, r);
            });
          })(n, t, e);
          return new ar(r, i);
        }
        {
          if (n.shouldAttach(t.value)) {
            const s = n.retrieve(t.value);
            if (null !== s) {
              const o = s.route;
              return (
                (o.value._futureSnapshot = t.value),
                (o.children = t.children.map((a) => oa(n, a))),
                o
              );
            }
          }
          const r = (function eU(n) {
              return new ci(
                new Ct(n.url),
                new Ct(n.params),
                new Ct(n.queryParams),
                new Ct(n.fragment),
                new Ct(n.data),
                n.outlet,
                n.component,
                n,
              );
            })(t.value),
            i = t.children.map((s) => oa(n, s));
          return new ar(r, i);
        }
      }
      const Jp = "ngNavigationCancelingError";
      function WS(n, t) {
        const { redirectTo: e, navigationBehaviorOptions: r } = ai(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          i = qS(!1, 0, t);
        return (i.url = e), (i.navigationBehaviorOptions = r), i;
      }
      function qS(n, t, e) {
        const r = new Error("NavigationCancelingError: " + (n || ""));
        return (r[Jp] = !0), (r.cancellationCode = t), e && (r.url = e), r;
      }
      function KS(n) {
        return YS(n) && ai(n.url);
      }
      function YS(n) {
        return n && n[Jp];
      }
      class tU {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new aa()),
            (this.attachRef = null);
        }
      }
      let aa = (() => {
        class n {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(e, r) {
            const i = this.getOrCreateContext(e);
            (i.outlet = r), this.contexts.set(e, i);
          }
          onChildOutletDestroyed(e) {
            const r = this.getContext(e);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const e = this.contexts;
            return (this.contexts = new Map()), e;
          }
          onOutletReAttached(e) {
            this.contexts = e;
          }
          getOrCreateContext(e) {
            let r = this.getContext(e);
            return r || ((r = new tU()), this.contexts.set(e, r)), r;
          }
          getContext(e) {
            return this.contexts.get(e) || null;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const Wc = !1;
      let eg = (() => {
        class n {
          constructor(e, r, i, s, o) {
            (this.parentContexts = e),
              (this.location = r),
              (this.changeDetector = s),
              (this.environmentInjector = o),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new ae()),
              (this.deactivateEvents = new ae()),
              (this.attachEvents = new ae()),
              (this.detachEvents = new ae()),
              (this.name = i || J),
              e.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.getContext(this.name)?.outlet === this &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const e = this.parentContexts.getContext(this.name);
              e &&
                e.route &&
                (e.attachRef
                  ? this.attach(e.attachRef, e.route)
                  : this.activateWith(e.route, e.injector));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new C(4012, Wc);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new C(4012, Wc);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new C(4012, Wc);
            this.location.detach();
            const e = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(e.instance),
              e
            );
          }
          attach(e, r) {
            (this.activated = e),
              (this._activatedRoute = r),
              this.location.insert(e.hostView),
              this.attachEvents.emit(e.instance);
          }
          deactivate() {
            if (this.activated) {
              const e = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(e);
            }
          }
          activateWith(e, r) {
            if (this.isActivated) throw new C(4013, Wc);
            this._activatedRoute = e;
            const i = this.location,
              o = e._futureSnapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new nU(e, a, i.injector);
            if (
              r &&
              (function rU(n) {
                return !!n.resolveComponentFactory;
              })(r)
            ) {
              const c = r.resolveComponentFactory(o);
              this.activated = i.createComponent(c, i.length, l);
            } else
              this.activated = i.createComponent(o, {
                index: i.length,
                injector: l,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(aa), _(Ut), Ri("name"), _(cs), _(mr));
          }),
          (n.ɵdir = F({
            type: n,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
          })),
          n
        );
      })();
      class nU {
        constructor(t, e, r) {
          (this.route = t), (this.childContexts = e), (this.parent = r);
        }
        get(t, e) {
          return t === ci
            ? this.route
            : t === aa
              ? this.childContexts
              : this.parent.get(t, e);
        }
      }
      let tg = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵcmp = Ot({
            type: n,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [jb],
            decls: 1,
            vars: 0,
            template: function (e, r) {
              1 & e && X(0, "router-outlet");
            },
            dependencies: [eg],
            encapsulation: 2,
          })),
          n
        );
      })();
      function ZS(n, t) {
        return (
          n.providers &&
            !n._injector &&
            (n._injector = Rl(n.providers, t, `Route: ${n.path}`)),
          n._injector ?? t
        );
      }
      function rg(n) {
        const t = n.children && n.children.map(rg),
          e = t ? { ...n, children: t } : { ...n };
        return (
          !e.component &&
            !e.loadComponent &&
            (t || e.loadChildren) &&
            e.outlet &&
            e.outlet !== J &&
            (e.component = tg),
          e
        );
      }
      function rn(n) {
        return n.outlet || J;
      }
      function QS(n, t) {
        const e = n.filter((r) => rn(r) === t);
        return e.push(...n.filter((r) => rn(r) !== t)), e;
      }
      function la(n) {
        if (!n) return null;
        if (n.routeConfig?._injector) return n.routeConfig._injector;
        for (let t = n.parent; t; t = t.parent) {
          const e = t.routeConfig;
          if (e?._loadedInjector) return e._loadedInjector;
          if (e?._injector) return e._injector;
        }
        return null;
      }
      class lU {
        constructor(t, e, r, i) {
          (this.routeReuseStrategy = t),
            (this.futureState = e),
            (this.currState = r),
            (this.forwardEvent = i);
        }
        activate(t) {
          const e = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(e, r, t),
            Qp(this.futureState.root),
            this.activateChildRoutes(e, r, t);
        }
        deactivateChildRoutes(t, e, r) {
          const i = ws(e);
          t.children.forEach((s) => {
            const o = s.value.outlet;
            this.deactivateRoutes(s, i[o], r), delete i[o];
          }),
            rt(i, (s, o) => {
              this.deactivateRouteAndItsChildren(s, r);
            });
        }
        deactivateRoutes(t, e, r) {
          const i = t.value,
            s = e ? e.value : null;
          if (i === s)
            if (i.component) {
              const o = r.getContext(i.outlet);
              o && this.deactivateChildRoutes(t, e, o.children);
            } else this.deactivateChildRoutes(t, e, r);
          else s && this.deactivateRouteAndItsChildren(e, r);
        }
        deactivateRouteAndItsChildren(t, e) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, e)
            : this.deactivateRouteAndOutlet(t, e);
        }
        detachAndStoreRouteSubtree(t, e) {
          const r = e.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : e,
            s = ws(t);
          for (const o of Object.keys(s))
            this.deactivateRouteAndItsChildren(s[o], i);
          if (r && r.outlet) {
            const o = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: o,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, e) {
          const r = e.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : e,
            s = ws(t);
          for (const o of Object.keys(s))
            this.deactivateRouteAndItsChildren(s[o], i);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, e, r) {
          const i = ws(e);
          t.children.forEach((s) => {
            this.activateRoutes(s, i[s.value.outlet], r),
              this.forwardEvent(new Kj(s.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new Wj(t.value.snapshot));
        }
        activateRoutes(t, e, r) {
          const i = t.value,
            s = e ? e.value : null;
          if ((Qp(i), i === s))
            if (i.component) {
              const o = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(t, e, o.children);
            } else this.activateChildRoutes(t, e, r);
          else if (i.component) {
            const o = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                o.children.onOutletReAttached(a.contexts),
                (o.attachRef = a.componentRef),
                (o.route = a.route.value),
                o.outlet && o.outlet.attach(a.componentRef, a.route.value),
                Qp(a.route.value),
                this.activateChildRoutes(t, null, o.children);
            } else {
              const a = la(i.snapshot),
                l = a?.get(Gr) ?? null;
              (o.attachRef = null),
                (o.route = i),
                (o.resolver = l),
                (o.injector = a),
                o.outlet && o.outlet.activateWith(i, o.injector),
                this.activateChildRoutes(t, null, o.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class XS {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class qc {
        constructor(t, e) {
          (this.component = t), (this.route = e);
        }
      }
      function cU(n, t, e) {
        const r = n._root;
        return ca(r, t ? t._root : null, e, [r.value]);
      }
      function Es(n, t) {
        const e = Symbol(),
          r = t.get(n, e);
        return r === e
          ? "function" != typeof n ||
            (function FA(n) {
              return null !== ka(n);
            })(n)
            ? t.get(n)
            : n
          : r;
      }
      function ca(
        n,
        t,
        e,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] },
      ) {
        const s = ws(t);
        return (
          n.children.forEach((o) => {
            (function dU(
              n,
              t,
              e,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] },
            ) {
              const s = n.value,
                o = t ? t.value : null,
                a = e ? e.getContext(n.value.outlet) : null;
              if (o && s.routeConfig === o.routeConfig) {
                const l = (function hU(n, t, e) {
                  if ("function" == typeof e) return e(n, t);
                  switch (e) {
                    case "pathParamsChange":
                      return !oi(n.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !oi(n.url, t.url) || !Vn(n.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Xp(n, t) || !Vn(n.queryParams, t.queryParams);
                    default:
                      return !Xp(n, t);
                  }
                })(o, s, s.routeConfig.runGuardsAndResolvers);
                l
                  ? i.canActivateChecks.push(new XS(r))
                  : ((s.data = o.data), (s._resolvedData = o._resolvedData)),
                  ca(n, t, s.component ? (a ? a.children : null) : e, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new qc(a.outlet.component, o));
              } else
                o && ua(t, a, i),
                  i.canActivateChecks.push(new XS(r)),
                  ca(n, null, s.component ? (a ? a.children : null) : e, r, i);
            })(o, s[o.value.outlet], e, r.concat([o.value]), i),
              delete s[o.value.outlet];
          }),
          rt(s, (o, a) => ua(o, e.getContext(a), i)),
          i
        );
      }
      function ua(n, t, e) {
        const r = ws(n),
          i = n.value;
        rt(r, (s, o) => {
          ua(s, i.component ? (t ? t.children.getContext(o) : null) : t, e);
        }),
          e.canDeactivateChecks.push(
            new qc(
              i.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              i,
            ),
          );
      }
      function da(n) {
        return "function" == typeof n;
      }
      function ig(n) {
        return n instanceof Pc || "EmptyError" === n?.name;
      }
      const Kc = Symbol("INITIAL_VALUE");
      function Ss() {
        return Ht((n) =>
          _S(n.map((t) => t.pipe(Tt(1), Zo(Kc)))).pipe(
            U((t) => {
              for (const e of t)
                if (!0 !== e) {
                  if (e === Kc) return Kc;
                  if (!1 === e || e instanceof si) return e;
                }
              return !0;
            }),
            Ze((t) => t !== Kc),
            Tt(1),
          ),
        );
      }
      function JS(n) {
        return (function iA(...n) {
          return dm(n);
        })(
          $e((t) => {
            if (ai(t)) throw WS(0, t);
          }),
          U((t) => !0 === t),
        );
      }
      const sg = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function eM(n, t, e, r, i) {
        const s = og(n, t, e);
        return s.matched
          ? (function IU(n, t, e, r) {
              const i = t.canMatch;
              return i && 0 !== i.length
                ? k(
                    i.map((o) => {
                      const a = Es(o, n);
                      return xr(
                        (function yU(n) {
                          return n && da(n.canMatch);
                        })(a)
                          ? a.canMatch(t, e)
                          : n.runInContext(() => a(t, e)),
                      );
                    }),
                  ).pipe(Ss(), JS())
                : k(!0);
            })((r = ZS(t, r)), t, e).pipe(U((o) => (!0 === o ? s : { ...sg })))
          : k(s);
      }
      function og(n, t, e) {
        if ("" === t.path)
          return "full" === t.pathMatch && (n.hasChildren() || e.length > 0)
            ? { ...sg }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: e,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (t.matcher || dj)(e, n, t);
        if (!i) return { ...sg };
        const s = {};
        rt(i.posParams, (a, l) => {
          s[l] = a.path;
        });
        const o =
          i.consumed.length > 0
            ? { ...s, ...i.consumed[i.consumed.length - 1].parameters }
            : s;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: e.slice(i.consumed.length),
          parameters: o,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function Yc(n, t, e, r, i = "corrected") {
        if (
          e.length > 0 &&
          (function OU(n, t, e) {
            return e.some((r) => Zc(n, t, r) && rn(r) !== J);
          })(n, e, r)
        ) {
          const o = new ee(
            t,
            (function xU(n, t, e, r) {
              const i = {};
              (i[J] = r),
                (r._sourceSegment = n),
                (r._segmentIndexShift = t.length);
              for (const s of e)
                if ("" === s.path && rn(s) !== J) {
                  const o = new ee([], {});
                  (o._sourceSegment = n),
                    (o._segmentIndexShift = t.length),
                    (i[rn(s)] = o);
                }
              return i;
            })(n, t, r, new ee(e, n.children)),
          );
          return (
            (o._sourceSegment = n),
            (o._segmentIndexShift = t.length),
            { segmentGroup: o, slicedSegments: [] }
          );
        }
        if (
          0 === e.length &&
          (function kU(n, t, e) {
            return e.some((r) => Zc(n, t, r));
          })(n, e, r)
        ) {
          const o = new ee(
            n.segments,
            (function RU(n, t, e, r, i, s) {
              const o = {};
              for (const a of r)
                if (Zc(n, e, a) && !i[rn(a)]) {
                  const l = new ee([], {});
                  (l._sourceSegment = n),
                    (l._segmentIndexShift =
                      "legacy" === s ? n.segments.length : t.length),
                    (o[rn(a)] = l);
                }
              return { ...i, ...o };
            })(n, t, e, r, n.children, i),
          );
          return (
            (o._sourceSegment = n),
            (o._segmentIndexShift = t.length),
            { segmentGroup: o, slicedSegments: e }
          );
        }
        const s = new ee(n.segments, n.children);
        return (
          (s._sourceSegment = n),
          (s._segmentIndexShift = t.length),
          { segmentGroup: s, slicedSegments: e }
        );
      }
      function Zc(n, t, e) {
        return (
          (!(n.hasChildren() || t.length > 0) || "full" !== e.pathMatch) &&
          "" === e.path
        );
      }
      function tM(n, t, e, r) {
        return (
          !!(rn(n) === r || (r !== J && Zc(t, e, n))) &&
          ("**" === n.path || og(t, n, e).matched)
        );
      }
      function nM(n, t, e) {
        return 0 === t.length && !n.children[e];
      }
      const Qc = !1;
      class Xc {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class rM {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function ha(n) {
        return ii(new Xc(n));
      }
      function iM(n) {
        return ii(new rM(n));
      }
      class LU {
        constructor(t, e, r, i, s) {
          (this.injector = t),
            (this.configLoader = e),
            (this.urlSerializer = r),
            (this.urlTree = i),
            (this.config = s),
            (this.allowRedirects = !0);
        }
        apply() {
          const t = Yc(this.urlTree.root, [], [], this.config).segmentGroup,
            e = new ee(t.segments, t.children);
          return this.expandSegmentGroup(this.injector, this.config, e, J)
            .pipe(
              U((s) =>
                this.createUrlTree(
                  $c(s),
                  this.urlTree.queryParams,
                  this.urlTree.fragment,
                ),
              ),
            )
            .pipe(
              Rr((s) => {
                if (s instanceof rM)
                  return (this.allowRedirects = !1), this.match(s.urlTree);
                throw s instanceof Xc ? this.noMatchError(s) : s;
              }),
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.injector, this.config, t.root, J)
            .pipe(
              U((i) => this.createUrlTree($c(i), t.queryParams, t.fragment)),
            )
            .pipe(
              Rr((i) => {
                throw i instanceof Xc ? this.noMatchError(i) : i;
              }),
            );
        }
        noMatchError(t) {
          return new C(4002, Qc);
        }
        createUrlTree(t, e, r) {
          const i = $p(t);
          return new si(i, e, r);
        }
        expandSegmentGroup(t, e, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, e, r).pipe(U((s) => new ee([], s)))
            : this.expandSegment(t, r, e, r.segments, i, !0);
        }
        expandChildren(t, e, r) {
          const i = [];
          for (const s of Object.keys(r.children))
            "primary" === s ? i.unshift(s) : i.push(s);
          return ze(i).pipe(
            Mr((s) => {
              const o = r.children[s],
                a = QS(e, s);
              return this.expandSegmentGroup(t, a, o, s).pipe(
                U((l) => ({ segment: l, outlet: s })),
              );
            }),
            Vp((s, o) => ((s[o.outlet] = o.segment), s), {}),
            vS(),
          );
        }
        expandSegment(t, e, r, i, s, o) {
          return ze(r).pipe(
            Mr((a) =>
              this.expandSegmentAgainstRoute(t, e, r, a, i, s, o).pipe(
                Rr((c) => {
                  if (c instanceof Xc) return k(null);
                  throw c;
                }),
              ),
            ),
            Ir((a) => !!a),
            Rr((a, l) => {
              if (ig(a)) return nM(e, i, s) ? k(new ee([], {})) : ha(e);
              throw a;
            }),
          );
        }
        expandSegmentAgainstRoute(t, e, r, i, s, o, a) {
          return tM(i, e, s, o)
            ? void 0 === i.redirectTo
              ? this.matchSegmentAgainstRoute(t, e, i, s, o)
              : a && this.allowRedirects
                ? this.expandSegmentAgainstRouteUsingRedirect(t, e, r, i, s, o)
                : ha(e)
            : ha(e);
        }
        expandSegmentAgainstRouteUsingRedirect(t, e, r, i, s, o) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, i, o)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                e,
                r,
                i,
                s,
                o,
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, e, r, i) {
          const s = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? iM(s)
            : this.lineralizeSegments(r, s).pipe(
                st((o) => {
                  const a = new ee(o, {});
                  return this.expandSegment(t, a, e, o, i, !1);
                }),
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, e, r, i, s, o) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: c,
            positionalParamSegments: u,
          } = og(e, i, s);
          if (!a) return ha(e);
          const d = this.applyRedirectCommands(l, i.redirectTo, u);
          return i.redirectTo.startsWith("/")
            ? iM(d)
            : this.lineralizeSegments(i, d).pipe(
                st((h) => this.expandSegment(t, e, r, h.concat(c), o, !1)),
              );
        }
        matchSegmentAgainstRoute(t, e, r, i, s) {
          return "**" === r.path
            ? ((t = ZS(r, t)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? k({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(t, r)
                  ).pipe(
                    U(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new ee(i, {})
                      ),
                    ),
                  )
                : k(new ee(i, {})))
            : eM(e, r, i, t).pipe(
                Ht(
                  ({
                    matched: o,
                    consumedSegments: a,
                    remainingSegments: l,
                  }) =>
                    o
                      ? this.getChildConfig((t = r._injector ?? t), r, i).pipe(
                          st((u) => {
                            const d = u.injector ?? t,
                              h = u.routes,
                              { segmentGroup: f, slicedSegments: p } = Yc(
                                e,
                                a,
                                l,
                                h,
                              ),
                              g = new ee(f.segments, f.children);
                            if (0 === p.length && g.hasChildren())
                              return this.expandChildren(d, h, g).pipe(
                                U((v) => new ee(a, v)),
                              );
                            if (0 === h.length && 0 === p.length)
                              return k(new ee(a, {}));
                            const y = rn(r) === s;
                            return this.expandSegment(
                              d,
                              g,
                              h,
                              p,
                              y ? J : s,
                              !0,
                            ).pipe(
                              U(
                                (M) => new ee(a.concat(M.segments), M.children),
                              ),
                            );
                          }),
                        )
                      : ha(e),
                ),
              );
        }
        getChildConfig(t, e, r) {
          return e.children
            ? k({ routes: e.children, injector: t })
            : e.loadChildren
              ? void 0 !== e._loadedRoutes
                ? k({ routes: e._loadedRoutes, injector: e._loadedInjector })
                : (function TU(n, t, e, r) {
                    const i = t.canLoad;
                    return void 0 === i || 0 === i.length
                      ? k(!0)
                      : k(
                          i.map((o) => {
                            const a = Es(o, n);
                            return xr(
                              (function pU(n) {
                                return n && da(n.canLoad);
                              })(a)
                                ? a.canLoad(t, e)
                                : n.runInContext(() => a(t, e)),
                            );
                          }),
                        ).pipe(Ss(), JS());
                  })(t, e, r).pipe(
                    st((i) =>
                      i
                        ? this.configLoader.loadChildren(t, e).pipe(
                            $e((s) => {
                              (e._loadedRoutes = s.routes),
                                (e._loadedInjector = s.injector);
                            }),
                          )
                        : (function PU(n) {
                            return ii(qS(Qc, 3));
                          })(),
                    ),
                  )
              : k({ routes: [], injector: t });
        }
        lineralizeSegments(t, e) {
          let r = [],
            i = e.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return k(r);
            if (i.numberOfChildren > 1 || !i.children[J])
              return ii(new C(4e3, Qc));
            i = i.children[J];
          }
        }
        applyRedirectCommands(t, e, r) {
          return this.applyRedirectCreateUrlTree(
            e,
            this.urlSerializer.parse(e),
            t,
            r,
          );
        }
        applyRedirectCreateUrlTree(t, e, r, i) {
          const s = this.createSegmentGroup(t, e.root, r, i);
          return new si(
            s,
            this.createQueryParams(e.queryParams, this.urlTree.queryParams),
            e.fragment,
          );
        }
        createQueryParams(t, e) {
          const r = {};
          return (
            rt(t, (i, s) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[s] = e[a];
              } else r[s] = i;
            }),
            r
          );
        }
        createSegmentGroup(t, e, r, i) {
          const s = this.createSegments(t, e.segments, r, i);
          let o = {};
          return (
            rt(e.children, (a, l) => {
              o[l] = this.createSegmentGroup(t, a, r, i);
            }),
            new ee(s, o)
          );
        }
        createSegments(t, e, r, i) {
          return e.map((s) =>
            s.path.startsWith(":")
              ? this.findPosParam(t, s, i)
              : this.findOrReturn(s, r),
          );
        }
        findPosParam(t, e, r) {
          const i = r[e.path.substring(1)];
          if (!i) throw new C(4001, Qc);
          return i;
        }
        findOrReturn(t, e) {
          let r = 0;
          for (const i of e) {
            if (i.path === t.path) return e.splice(r), i;
            r++;
          }
          return t;
        }
      }
      class BU {}
      class HU {
        constructor(t, e, r, i, s, o, a, l) {
          (this.injector = t),
            (this.rootComponentType = e),
            (this.config = r),
            (this.urlTree = i),
            (this.url = s),
            (this.paramsInheritanceStrategy = o),
            (this.relativeLinkResolution = a),
            (this.urlSerializer = l);
        }
        recognize() {
          const t = Yc(
            this.urlTree.root,
            [],
            [],
            this.config.filter((e) => void 0 === e.redirectTo),
            this.relativeLinkResolution,
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            J,
          ).pipe(
            U((e) => {
              if (null === e) return null;
              const r = new Gc(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  J,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {},
                ),
                i = new ar(r, e),
                s = new zS(this.url, i);
              return this.inheritParamsAndData(s._root), s;
            }),
          );
        }
        inheritParamsAndData(t) {
          const e = t.value,
            r = $S(e, this.paramsInheritanceStrategy);
          (e.params = Object.freeze(r.params)),
            (e.data = Object.freeze(r.data)),
            t.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(t, e, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, e, r)
            : this.processSegment(t, e, r, r.segments, i);
        }
        processChildren(t, e, r) {
          return ze(Object.keys(r.children)).pipe(
            Mr((i) => {
              const s = r.children[i],
                o = QS(e, i);
              return this.processSegmentGroup(t, o, s, i);
            }),
            Vp((i, s) => (i && s ? (i.push(...s), i) : null)),
            (function nj(n, t = !1) {
              return (e) => e.lift(new rj(n, t));
            })((i) => null !== i),
            Nc(null),
            vS(),
            U((i) => {
              if (null === i) return null;
              const s = sM(i);
              return (
                (function $U(n) {
                  n.sort((t, e) =>
                    t.value.outlet === J
                      ? -1
                      : e.value.outlet === J
                        ? 1
                        : t.value.outlet.localeCompare(e.value.outlet),
                  );
                })(s),
                s
              );
            }),
          );
        }
        processSegment(t, e, r, i, s) {
          return ze(e).pipe(
            Mr((o) =>
              this.processSegmentAgainstRoute(o._injector ?? t, o, r, i, s),
            ),
            Ir((o) => !!o),
            Rr((o) => {
              if (ig(o)) return nM(r, i, s) ? k([]) : k(null);
              throw o;
            }),
          );
        }
        processSegmentAgainstRoute(t, e, r, i, s) {
          if (e.redirectTo || !tM(e, r, i, s)) return k(null);
          let o;
          if ("**" === e.path) {
            const a = i.length > 0 ? DS(i).parameters : {},
              l = aM(r) + i.length;
            o = k({
              snapshot: new Gc(
                i,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                cM(e),
                rn(e),
                e.component ?? e._loadedComponent ?? null,
                e,
                oM(r),
                l,
                uM(e),
                l,
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            o = eM(r, e, i, t).pipe(
              U(
                ({
                  matched: a,
                  consumedSegments: l,
                  remainingSegments: c,
                  parameters: u,
                }) => {
                  if (!a) return null;
                  const d = aM(r) + l.length;
                  return {
                    snapshot: new Gc(
                      l,
                      u,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      cM(e),
                      rn(e),
                      e.component ?? e._loadedComponent ?? null,
                      e,
                      oM(r),
                      d,
                      uM(e),
                      d,
                    ),
                    consumedSegments: l,
                    remainingSegments: c,
                  };
                },
              ),
            );
          return o.pipe(
            Ht((a) => {
              if (null === a) return k(null);
              const {
                snapshot: l,
                consumedSegments: c,
                remainingSegments: u,
              } = a;
              t = e._injector ?? t;
              const d = e._loadedInjector ?? t,
                h = (function zU(n) {
                  return n.children
                    ? n.children
                    : n.loadChildren
                      ? n._loadedRoutes
                      : [];
                })(e),
                { segmentGroup: f, slicedSegments: p } = Yc(
                  r,
                  c,
                  u,
                  h.filter((y) => void 0 === y.redirectTo),
                  this.relativeLinkResolution,
                );
              if (0 === p.length && f.hasChildren())
                return this.processChildren(d, h, f).pipe(
                  U((y) => (null === y ? null : [new ar(l, y)])),
                );
              if (0 === h.length && 0 === p.length) return k([new ar(l, [])]);
              const g = rn(e) === s;
              return this.processSegment(d, h, f, p, g ? J : s).pipe(
                U((y) => (null === y ? null : [new ar(l, y)])),
              );
            }),
          );
        }
      }
      function GU(n) {
        const t = n.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function sM(n) {
        const t = [],
          e = new Set();
        for (const r of n) {
          if (!GU(r)) {
            t.push(r);
            continue;
          }
          const i = t.find((s) => r.value.routeConfig === s.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), e.add(i)) : t.push(r);
        }
        for (const r of e) {
          const i = sM(r.children);
          t.push(new ar(r.value, i));
        }
        return t.filter((r) => !e.has(r));
      }
      function oM(n) {
        let t = n;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function aM(n) {
        let t = n,
          e = t._segmentIndexShift ?? 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment), (e += t._segmentIndexShift ?? 0);
        return e - 1;
      }
      function cM(n) {
        return n.data || {};
      }
      function uM(n) {
        return n.resolve || {};
      }
      function dM(n) {
        return "string" == typeof n.title || null === n.title;
      }
      function ag(n) {
        return Ht((t) => {
          const e = n(t);
          return e ? ze(e).pipe(U(() => t)) : k(t);
        });
      }
      let hM = (() => {
          class n {
            buildTitle(e) {
              let r,
                i = e.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r),
                  (i = i.children.find((s) => s.outlet === J));
              return r;
            }
            getResolvedTitleForRoute(e) {
              return e.data[ea];
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = A({
              token: n,
              factory: function () {
                return te(fM);
              },
              providedIn: "root",
            })),
            n
          );
        })(),
        fM = (() => {
          class n extends hM {
            constructor(e) {
              super(), (this.title = e);
            }
            updateTitle(e) {
              const r = this.buildTitle(e);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(WD));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })();
      class JU {}
      class tH extends class eH {
        shouldDetach(t) {
          return !1;
        }
        store(t, e) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, e) {
          return t.routeConfig === e.routeConfig;
        }
      } {}
      const eu = new w("", { providedIn: "root", factory: () => ({}) }),
        lg = new w("ROUTES");
      let cg = (() => {
        class n {
          constructor(e, r) {
            (this.injector = e),
              (this.compiler = r),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(e) {
            if (this.componentLoaders.get(e))
              return this.componentLoaders.get(e);
            if (e._loadedComponent) return k(e._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(e);
            const r = xr(e.loadComponent()).pipe(
                $e((s) => {
                  this.onLoadEndListener && this.onLoadEndListener(e),
                    (e._loadedComponent = s);
                }),
                Lc(() => {
                  this.componentLoaders.delete(e);
                }),
              ),
              i = new Fu(r, () => new de()).pipe(Ra());
            return this.componentLoaders.set(e, i), i;
          }
          loadChildren(e, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return k({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const s = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                U((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l,
                    c,
                    u = !1;
                  Array.isArray(a)
                    ? (c = a)
                    : ((l = a.create(e).injector),
                      (c = CS(l.get(lg, [], P.Self | P.Optional))));
                  return { routes: c.map(rg), injector: l };
                }),
                Lc(() => {
                  this.childrenLoaders.delete(r);
                }),
              ),
              o = new Fu(s, () => new de()).pipe(Ra());
            return this.childrenLoaders.set(r, o), o;
          }
          loadModuleFactoryOrRoutes(e) {
            return xr(e()).pipe(
              st((r) =>
                r instanceof Vb || Array.isArray(r)
                  ? k(r)
                  : ze(this.compiler.compileModuleAsync(r)),
              ),
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Ne), m(tf));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      class rH {}
      class iH {
        shouldProcessUrl(t) {
          return !0;
        }
        extract(t) {
          return t;
        }
        merge(t, e) {
          return t;
        }
      }
      function sH(n) {
        throw n;
      }
      function oH(n, t, e) {
        return t.parse("/");
      }
      const aH = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        lH = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      function gM() {
        const n = te(TS),
          t = te(aa),
          e = te(xo),
          r = te(Ne),
          i = te(tf),
          s = te(lg, { optional: !0 }) ?? [],
          o = te(eu, { optional: !0 }) ?? {},
          a = te(fM),
          l = te(hM, { optional: !0 }),
          c = te(rH, { optional: !0 }),
          u = te(JU, { optional: !0 }),
          d = new it(null, n, t, e, r, i, CS(s));
        return (
          c && (d.urlHandlingStrategy = c),
          u && (d.routeReuseStrategy = u),
          (d.titleStrategy = l ?? a),
          (function cH(n, t) {
            n.errorHandler && (t.errorHandler = n.errorHandler),
              n.malformedUriErrorHandler &&
                (t.malformedUriErrorHandler = n.malformedUriErrorHandler),
              n.onSameUrlNavigation &&
                (t.onSameUrlNavigation = n.onSameUrlNavigation),
              n.paramsInheritanceStrategy &&
                (t.paramsInheritanceStrategy = n.paramsInheritanceStrategy),
              n.relativeLinkResolution &&
                (t.relativeLinkResolution = n.relativeLinkResolution),
              n.urlUpdateStrategy &&
                (t.urlUpdateStrategy = n.urlUpdateStrategy),
              n.canceledNavigationResolution &&
                (t.canceledNavigationResolution =
                  n.canceledNavigationResolution);
          })(o, d),
          d
        );
      }
      let it = (() => {
        class n {
          constructor(e, r, i, s, o, a, l) {
            (this.rootComponentType = e),
              (this.urlSerializer = r),
              (this.rootContexts = i),
              (this.location = s),
              (this.config = l),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new de()),
              (this.errorHandler = sH),
              (this.malformedUriErrorHandler = oH),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.afterPreactivation = () => k(void 0)),
              (this.urlHandlingStrategy = new iH()),
              (this.routeReuseStrategy = new tH()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.configLoader = o.get(cg)),
              (this.configLoader.onLoadEndListener = (h) =>
                this.triggerEvent(new zj(h))),
              (this.configLoader.onLoadStartListener = (h) =>
                this.triggerEvent(new $j(h))),
              (this.ngModule = o.get(Yr)),
              (this.console = o.get(pP));
            const d = o.get(le);
            (this.isNgZoneEnabled = d instanceof le && le.isInAngularZone()),
              this.resetConfig(l),
              (this.currentUrlTree = (function fj() {
                return new si(new ee([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = HS(
                this.currentUrlTree,
                this.rootComponentType,
              )),
              (this.transitions = new Ct({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree,
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree,
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            return this.location.getState()?.ɵrouterPageId;
          }
          setupNavigations(e) {
            const r = this.events;
            return e.pipe(
              Ze((i) => 0 !== i.id),
              U((i) => ({
                ...i,
                extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl),
              })),
              Ht((i) => {
                let s = !1,
                  o = !1;
                return k(i).pipe(
                  $e((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.rawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? {
                            ...this.lastSuccessfulNavigation,
                            previousNavigation: null,
                          }
                        : null,
                    };
                  }),
                  Ht((a) => {
                    const l = this.browserUrlTree.toString(),
                      c =
                        !this.navigated ||
                        a.extractedUrl.toString() !== l ||
                        l !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || c) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        mM(a.source) && (this.browserUrlTree = a.extractedUrl),
                        k(a).pipe(
                          Ht((d) => {
                            const h = this.transitions.getValue();
                            return (
                              r.next(
                                new qp(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState,
                                ),
                              ),
                              h !== this.transitions.getValue()
                                ? _s
                                : Promise.resolve(d)
                            );
                          }),
                          (function VU(n, t, e, r) {
                            return Ht((i) =>
                              (function NU(n, t, e, r, i) {
                                return new LU(n, t, e, r, i).apply();
                              })(n, t, e, i.extractedUrl, r).pipe(
                                U((s) => ({ ...i, urlAfterRedirects: s })),
                              ),
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config,
                          ),
                          $e((d) => {
                            (this.currentNavigation = {
                              ...this.currentNavigation,
                              finalUrl: d.urlAfterRedirects,
                            }),
                              (i.urlAfterRedirects = d.urlAfterRedirects);
                          }),
                          (function qU(n, t, e, r, i, s) {
                            return st((o) =>
                              (function UU(
                                n,
                                t,
                                e,
                                r,
                                i,
                                s,
                                o = "emptyOnly",
                                a = "legacy",
                              ) {
                                return new HU(n, t, e, r, i, o, a, s)
                                  .recognize()
                                  .pipe(
                                    Ht((l) =>
                                      null === l
                                        ? (function jU(n) {
                                            return new ye((t) => t.error(n));
                                          })(new BU())
                                        : k(l),
                                    ),
                                  );
                              })(
                                n,
                                t,
                                e,
                                o.urlAfterRedirects,
                                r.serialize(o.urlAfterRedirects),
                                r,
                                i,
                                s,
                              ).pipe(U((a) => ({ ...o, targetSnapshot: a }))),
                            );
                          })(
                            this.ngModule.injector,
                            this.rootComponentType,
                            this.config,
                            this.urlSerializer,
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution,
                          ),
                          $e((d) => {
                            if (
                              ((i.targetSnapshot = d.targetSnapshot),
                              "eager" === this.urlUpdateStrategy)
                            ) {
                              if (!d.extras.skipLocationChange) {
                                const f = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl,
                                );
                                this.setBrowserUrl(f, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const h = new Vj(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot,
                            );
                            r.next(h);
                          }),
                        )
                      );
                    if (
                      c &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: h,
                          extractedUrl: f,
                          source: p,
                          restoredState: g,
                          extras: y,
                        } = a,
                        b = new qp(h, this.serializeUrl(f), p, g);
                      r.next(b);
                      const M = HS(f, this.rootComponentType).snapshot;
                      return k(
                        (i = {
                          ...a,
                          targetSnapshot: M,
                          urlAfterRedirects: f,
                          extras: {
                            ...y,
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          },
                        }),
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), _s;
                  }),
                  $e((a) => {
                    const l = new Bj(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                    );
                    this.triggerEvent(l);
                  }),
                  U(
                    (a) =>
                      (i = {
                        ...a,
                        guards: cU(
                          a.targetSnapshot,
                          a.currentSnapshot,
                          this.rootContexts,
                        ),
                      }),
                  ),
                  (function bU(n, t) {
                    return st((e) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: i,
                        guards: {
                          canActivateChecks: s,
                          canDeactivateChecks: o,
                        },
                      } = e;
                      return 0 === o.length && 0 === s.length
                        ? k({ ...e, guardsResult: !0 })
                        : (function CU(n, t, e, r) {
                            return ze(n).pipe(
                              st((i) =>
                                (function AU(n, t, e, r, i) {
                                  const s =
                                    t && t.routeConfig
                                      ? t.routeConfig.canDeactivate
                                      : null;
                                  return s && 0 !== s.length
                                    ? k(
                                        s.map((a) => {
                                          const l = la(t) ?? i,
                                            c = Es(a, l);
                                          return xr(
                                            (function _U(n) {
                                              return n && da(n.canDeactivate);
                                            })(c)
                                              ? c.canDeactivate(n, t, e, r)
                                              : l.runInContext(() =>
                                                  c(n, t, e, r),
                                                ),
                                          ).pipe(Ir());
                                        }),
                                      ).pipe(Ss())
                                    : k(!0);
                                })(i.component, i.route, e, t, r),
                              ),
                              Ir((i) => !0 !== i, !0),
                            );
                          })(o, r, i, n).pipe(
                            st((a) =>
                              a &&
                              (function fU(n) {
                                return "boolean" == typeof n;
                              })(a)
                                ? (function DU(n, t, e, r) {
                                    return ze(t).pipe(
                                      Mr((i) =>
                                        Fp(
                                          (function EU(n, t) {
                                            return (
                                              null !== n && t && t(new Gj(n)),
                                              k(!0)
                                            );
                                          })(i.route.parent, r),
                                          (function wU(n, t) {
                                            return (
                                              null !== n && t && t(new qj(n)),
                                              k(!0)
                                            );
                                          })(i.route, r),
                                          (function MU(n, t, e) {
                                            const r = t[t.length - 1],
                                              s = t
                                                .slice(0, t.length - 1)
                                                .reverse()
                                                .map((o) =>
                                                  (function uU(n) {
                                                    const t = n.routeConfig
                                                      ? n.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return t && 0 !== t.length
                                                      ? { node: n, guards: t }
                                                      : null;
                                                  })(o),
                                                )
                                                .filter((o) => null !== o)
                                                .map((o) =>
                                                  kp(() =>
                                                    k(
                                                      o.guards.map((l) => {
                                                        const c =
                                                            la(o.node) ?? e,
                                                          u = Es(l, c);
                                                        return xr(
                                                          (function mU(n) {
                                                            return (
                                                              n &&
                                                              da(
                                                                n.canActivateChild,
                                                              )
                                                            );
                                                          })(u)
                                                            ? u.canActivateChild(
                                                                r,
                                                                n,
                                                              )
                                                            : c.runInContext(
                                                                () => u(r, n),
                                                              ),
                                                        ).pipe(Ir());
                                                      }),
                                                    ).pipe(Ss()),
                                                  ),
                                                );
                                            return k(s).pipe(Ss());
                                          })(n, i.path, e),
                                          (function SU(n, t, e) {
                                            const r = t.routeConfig
                                              ? t.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return k(!0);
                                            const i = r.map((s) =>
                                              kp(() => {
                                                const o = la(t) ?? e,
                                                  a = Es(s, o);
                                                return xr(
                                                  (function gU(n) {
                                                    return (
                                                      n && da(n.canActivate)
                                                    );
                                                  })(a)
                                                    ? a.canActivate(t, n)
                                                    : o.runInContext(() =>
                                                        a(t, n),
                                                      ),
                                                ).pipe(Ir());
                                              }),
                                            );
                                            return k(i).pipe(Ss());
                                          })(n, i.route, e),
                                        ),
                                      ),
                                      Ir((i) => !0 !== i, !0),
                                    );
                                  })(r, s, n, t)
                                : k(a),
                            ),
                            U((a) => ({ ...e, guardsResult: a })),
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  $e((a) => {
                    if (((i.guardsResult = a.guardsResult), ai(a.guardsResult)))
                      throw WS(0, a.guardsResult);
                    const l = new jj(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult,
                    );
                    this.triggerEvent(l);
                  }),
                  Ze(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, "", 3),
                      !1),
                  ),
                  ag((a) => {
                    if (a.guards.canActivateChecks.length)
                      return k(a).pipe(
                        $e((l) => {
                          const c = new Uj(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot,
                          );
                          this.triggerEvent(c);
                        }),
                        Ht((l) => {
                          let c = !1;
                          return k(l).pipe(
                            (function KU(n, t) {
                              return st((e) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: i },
                                } = e;
                                if (!i.length) return k(e);
                                let s = 0;
                                return ze(i).pipe(
                                  Mr((o) =>
                                    (function YU(n, t, e, r) {
                                      const i = n.routeConfig,
                                        s = n._resolve;
                                      return (
                                        void 0 !== i?.title &&
                                          !dM(i) &&
                                          (s[ea] = i.title),
                                        (function ZU(n, t, e, r) {
                                          const i = (function QU(n) {
                                            return [
                                              ...Object.keys(n),
                                              ...Object.getOwnPropertySymbols(
                                                n,
                                              ),
                                            ];
                                          })(n);
                                          if (0 === i.length) return k({});
                                          const s = {};
                                          return ze(i).pipe(
                                            st((o) =>
                                              (function XU(n, t, e, r) {
                                                const i = la(t) ?? r,
                                                  s = Es(n, i);
                                                return xr(
                                                  s.resolve
                                                    ? s.resolve(t, e)
                                                    : i.runInContext(() =>
                                                        s(t, e),
                                                      ),
                                                );
                                              })(n[o], t, e, r).pipe(
                                                Ir(),
                                                $e((a) => {
                                                  s[o] = a;
                                                }),
                                              ),
                                            ),
                                            Bp(1),
                                            (function sj(n) {
                                              return (t) => t.lift(new oj(n));
                                            })(s),
                                            Rr((o) => (ig(o) ? _s : ii(o))),
                                          );
                                        })(s, n, t, r).pipe(
                                          U(
                                            (o) => (
                                              (n._resolvedData = o),
                                              (n.data = $S(n, e).resolve),
                                              i &&
                                                dM(i) &&
                                                (n.data[ea] = i.title),
                                              null
                                            ),
                                          ),
                                        )
                                      );
                                    })(o.route, r, n, t),
                                  ),
                                  $e(() => s++),
                                  Bp(1),
                                  st((o) => (s === i.length ? k(e) : _s)),
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector,
                            ),
                            $e({
                              next: () => (c = !0),
                              complete: () => {
                                c ||
                                  (this.restoreHistory(l),
                                  this.cancelNavigationTransition(l, "", 2));
                              },
                            }),
                          );
                        }),
                        $e((l) => {
                          const c = new Hj(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot,
                          );
                          this.triggerEvent(c);
                        }),
                      );
                  }),
                  ag((a) => {
                    const l = (c) => {
                      const u = [];
                      c.routeConfig?.loadComponent &&
                        !c.routeConfig._loadedComponent &&
                        u.push(
                          this.configLoader.loadComponent(c.routeConfig).pipe(
                            $e((d) => {
                              c.component = d;
                            }),
                            U(() => {}),
                          ),
                        );
                      for (const d of c.children) u.push(...l(d));
                      return u;
                    };
                    return _S(l(a.targetSnapshot.root)).pipe(Nc(), Tt(1));
                  }),
                  ag(() => this.afterPreactivation()),
                  U((a) => {
                    const l = (function Xj(n, t, e) {
                      const r = oa(n, t._root, e ? e._root : void 0);
                      return new US(r, t);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState,
                    );
                    return (i = { ...a, targetRouterState: l });
                  }),
                  $e((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl,
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((n, t, e) =>
                    U(
                      (r) => (
                        new lU(
                          t,
                          r.targetRouterState,
                          r.currentRouterState,
                          e,
                        ).activate(n),
                        r
                      ),
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a),
                  ),
                  $e({
                    next() {
                      s = !0;
                    },
                    complete() {
                      s = !0;
                    },
                  }),
                  Lc(() => {
                    s || o || this.cancelNavigationTransition(i, "", 1),
                      this.currentNavigation?.id === i.id &&
                        (this.currentNavigation = null);
                  }),
                  Rr((a) => {
                    if (((o = !0), YS(a))) {
                      KS(a) ||
                        ((this.navigated = !0), this.restoreHistory(i, !0));
                      const l = new zc(
                        i.id,
                        this.serializeUrl(i.extractedUrl),
                        a.message,
                        a.cancellationCode,
                      );
                      if ((r.next(l), KS(a))) {
                        const c = this.urlHandlingStrategy.merge(
                            a.url,
                            this.rawUrlTree,
                          ),
                          u = {
                            skipLocationChange: i.extras.skipLocationChange,
                            replaceUrl:
                              "eager" === this.urlUpdateStrategy ||
                              mM(i.source),
                          };
                        this.scheduleNavigation(c, "imperative", null, u, {
                          resolve: i.resolve,
                          reject: i.reject,
                          promise: i.promise,
                        });
                      } else i.resolve(!1);
                    } else {
                      this.restoreHistory(i, !0);
                      const l = new VS(
                        i.id,
                        this.serializeUrl(i.extractedUrl),
                        a,
                        i.targetSnapshot ?? void 0,
                      );
                      r.next(l);
                      try {
                        i.resolve(this.errorHandler(a));
                      } catch (c) {
                        i.reject(c);
                      }
                    }
                    return _s;
                  }),
                );
              }),
            );
          }
          resetRootComponentType(e) {
            (this.rootComponentType = e),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(e) {
            this.transitions.next({ ...this.transitions.value, ...e });
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((e) => {
                const r = "popstate" === e.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    const i = { replaceUrl: !0 },
                      s = e.state?.navigationId ? e.state : null;
                    if (s) {
                      const a = { ...s };
                      delete a.navigationId,
                        delete a.ɵrouterPageId,
                        0 !== Object.keys(a).length && (i.state = a);
                    }
                    const o = this.parseUrl(e.url);
                    this.scheduleNavigation(o, r, s, i);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(e) {
            this.events.next(e);
          }
          resetConfig(e) {
            (this.config = e.map(rg)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(e, r = {}) {
            const {
                relativeTo: i,
                queryParams: s,
                fragment: o,
                queryParamsHandling: a,
                preserveFragment: l,
              } = r,
              c = i || this.routerState.root,
              u = l ? this.currentUrlTree.fragment : o;
            let d = null;
            switch (a) {
              case "merge":
                d = { ...this.currentUrlTree.queryParams, ...s };
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = s || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              Oj(c, this.currentUrlTree, e, d, u ?? null)
            );
          }
          navigateByUrl(e, r = { skipLocationChange: !1 }) {
            const i = ai(e) ? e : this.parseUrl(e),
              s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
            return this.scheduleNavigation(s, "imperative", null, r);
          }
          navigate(e, r = { skipLocationChange: !1 }) {
            return (
              (function uH(n) {
                for (let t = 0; t < n.length; t++) {
                  if (null == n[t]) throw new C(4008, false);
                }
              })(e),
              this.navigateByUrl(this.createUrlTree(e, r), r)
            );
          }
          serializeUrl(e) {
            return this.urlSerializer.serialize(e);
          }
          parseUrl(e) {
            let r;
            try {
              r = this.urlSerializer.parse(e);
            } catch (i) {
              r = this.malformedUriErrorHandler(i, this.urlSerializer, e);
            }
            return r;
          }
          isActive(e, r) {
            let i;
            if (((i = !0 === r ? { ...aH } : !1 === r ? { ...lH } : r), ai(e)))
              return ES(this.currentUrlTree, e, i);
            const s = this.parseUrl(e);
            return ES(this.currentUrlTree, s, i);
          }
          removeEmptyProps(e) {
            return Object.keys(e).reduce((r, i) => {
              const s = e[i];
              return null != s && (r[i] = s), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (e) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = e.id),
                  (this.currentPageId = e.targetPageId),
                  this.events.next(
                    new li(
                      e.id,
                      this.serializeUrl(e.extractedUrl),
                      this.serializeUrl(this.currentUrlTree),
                    ),
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  this.titleStrategy?.updateTitle(this.routerState.snapshot),
                  e.resolve(!0);
              },
              (e) => {
                this.console.warn(`Unhandled Navigation Error: ${e}`);
              },
            );
          }
          scheduleNavigation(e, r, i, s, o) {
            if (this.disposed) return Promise.resolve(!1);
            let a, l, c;
            o
              ? ((a = o.resolve), (l = o.reject), (c = o.promise))
              : (c = new Promise((h, f) => {
                  (a = h), (l = f);
                }));
            const u = ++this.navigationId;
            let d;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (i = this.location.getState()),
                  (d =
                    i && i.ɵrouterPageId
                      ? i.ɵrouterPageId
                      : s.replaceUrl || s.skipLocationChange
                        ? this.browserPageId ?? 0
                        : (this.browserPageId ?? 0) + 1))
                : (d = 0),
              this.setTransition({
                id: u,
                targetPageId: d,
                source: r,
                restoredState: i,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: e,
                extras: s,
                resolve: a,
                reject: l,
                promise: c,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              c.catch((h) => Promise.reject(h))
            );
          }
          setBrowserUrl(e, r) {
            const i = this.urlSerializer.serialize(e),
              s = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, r.targetPageId),
              };
            this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl
              ? this.location.replaceState(i, "", s)
              : this.location.go(i, "", s);
          }
          restoreHistory(e, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i = this.currentPageId - e.targetPageId;
              ("popstate" !== e.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !== this.currentNavigation?.finalUrl) ||
              0 === i
                ? this.currentUrlTree === this.currentNavigation?.finalUrl &&
                  0 === i &&
                  (this.resetState(e),
                  (this.browserUrlTree = e.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(i);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(e), this.resetUrlToCurrentUrlTree());
          }
          resetState(e) {
            (this.routerState = e.currentRouterState),
              (this.currentUrlTree = e.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                e.rawUrl,
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId,
              ),
            );
          }
          cancelNavigationTransition(e, r, i) {
            const s = new zc(e.id, this.serializeUrl(e.extractedUrl), r, i);
            this.triggerEvent(s), e.resolve(!1);
          }
          generateNgRouterState(e, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: e, ɵrouterPageId: r }
              : { navigationId: e };
          }
        }
        return (
          (n.ɵfac = function (e) {
            fl();
          }),
          (n.ɵprov = A({
            token: n,
            factory: function () {
              return gM();
            },
            providedIn: "root",
          })),
          n
        );
      })();
      function mM(n) {
        return "imperative" !== n;
      }
      class _M {}
      let fH = (() => {
        class n {
          constructor(e, r, i, s, o) {
            (this.router = e),
              (this.injector = i),
              (this.preloadingStrategy = s),
              (this.loader = o);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Ze((e) => e instanceof li),
                Mr(() => this.preload()),
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(e, r) {
            const i = [];
            for (const s of r) {
              s.providers &&
                !s._injector &&
                (s._injector = Rl(s.providers, e, `Route: ${s.path}`));
              const o = s._injector ?? e,
                a = s._loadedInjector ?? o;
              (s.loadChildren && !s._loadedRoutes && void 0 === s.canLoad) ||
              (s.loadComponent && !s._loadedComponent)
                ? i.push(this.preloadConfig(o, s))
                : (s.children || s._loadedRoutes) &&
                  i.push(this.processRoutes(a, s.children ?? s._loadedRoutes));
            }
            return ze(i).pipe(vi());
          }
          preloadConfig(e, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(e, r)
                  : k(null);
              const s = i.pipe(
                st((o) =>
                  null === o
                    ? k(void 0)
                    : ((r._loadedRoutes = o.routes),
                      (r._loadedInjector = o.injector),
                      this.processRoutes(o.injector ?? e, o.routes)),
                ),
              );
              return r.loadComponent && !r._loadedComponent
                ? ze([s, this.loader.loadComponent(r)]).pipe(vi())
                : s;
            });
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(it), m(tf), m(mr), m(_M), m(cg));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const hg = new w("");
      let yM = (() => {
        class n {
          constructor(e, r, i = {}) {
            (this.router = e),
              (this.viewportScroller = r),
              (this.options = i),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (i.scrollPositionRestoration =
                i.scrollPositionRestoration || "disabled"),
              (i.anchorScrolling = i.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.router.events.subscribe((e) => {
              e instanceof qp
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = e.navigationTrigger),
                  (this.restoredId = e.restoredState
                    ? e.restoredState.navigationId
                    : 0))
                : e instanceof li &&
                  ((this.lastId = e.id),
                  this.scheduleScrollEvent(
                    e,
                    this.router.parseUrl(e.urlAfterRedirects).fragment,
                  ));
            });
          }
          consumeScrollEvents() {
            return this.router.events.subscribe((e) => {
              e instanceof BS &&
                (e.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(e.position)
                  : e.anchor && "enabled" === this.options.anchorScrolling
                    ? this.viewportScroller.scrollToAnchor(e.anchor)
                    : "disabled" !== this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(e, r) {
            this.router.triggerEvent(
              new BS(
                e,
                "popstate" === this.lastSource
                  ? this.store[this.restoredId]
                  : null,
                r,
              ),
            );
          }
          ngOnDestroy() {
            this.routerEventsSubscription &&
              this.routerEventsSubscription.unsubscribe(),
              this.scrollEventsSubscription &&
                this.scrollEventsSubscription.unsubscribe();
          }
        }
        return (
          (n.ɵfac = function (e) {
            fl();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      function Ms(n, t) {
        return { ɵkind: n, ɵproviders: t };
      }
      function fg(n) {
        return [{ provide: lg, multi: !0, useValue: n }];
      }
      function bM() {
        const n = te(Ne);
        return (t) => {
          const e = n.get(ls);
          if (t !== e.components[0]) return;
          const r = n.get(it),
            i = n.get(CM);
          1 === n.get(pg) && r.initialNavigation(),
            n.get(DM, null, P.Optional)?.setUpPreloading(),
            n.get(hg, null, P.Optional)?.init(),
            r.resetRootComponentType(e.componentTypes[0]),
            i.closed || (i.next(), i.unsubscribe());
        };
      }
      const CM = new w("", { factory: () => new de() }),
        pg = new w("", { providedIn: "root", factory: () => 1 });
      const DM = new w("");
      function _H(n) {
        return Ms(0, [
          { provide: DM, useExisting: fH },
          { provide: _M, useExisting: n },
        ]);
      }
      const wM = new w("ROUTER_FORROOT_GUARD"),
        yH = [
          xo,
          { provide: TS, useClass: Up },
          { provide: it, useFactory: gM },
          aa,
          {
            provide: ci,
            useFactory: function vM(n) {
              return n.routerState.root;
            },
            deps: [it],
          },
          cg,
        ];
      function vH() {
        return new kC("Router", it);
      }
      let EM = (() => {
        class n {
          constructor(e) {}
          static forRoot(e, r) {
            return {
              ngModule: n,
              providers: [
                yH,
                [],
                fg(e),
                {
                  provide: wM,
                  useFactory: wH,
                  deps: [[it, new Wn(), new jr()]],
                },
                { provide: eu, useValue: r || {} },
                r?.useHash
                  ? { provide: Qr, useClass: rN }
                  : { provide: Qr, useClass: iD },
                {
                  provide: hg,
                  useFactory: () => {
                    const n = te(it),
                      t = te(C1),
                      e = te(eu);
                    return (
                      e.scrollOffset && t.setOffset(e.scrollOffset),
                      new yM(n, t, e)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? _H(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: kC, multi: !0, useFactory: vH },
                r?.initialNavigation ? EH(r) : [],
                [
                  { provide: SM, useFactory: bM },
                  { provide: MC, multi: !0, useExisting: SM },
                ],
              ],
            };
          }
          static forChild(e) {
            return { ngModule: n, providers: [fg(e)] };
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(wM, 8));
          }),
          (n.ɵmod = ve({ type: n })),
          (n.ɵinj = _e({ imports: [tg] })),
          n
        );
      })();
      function wH(n) {
        return "guarded";
      }
      function EH(n) {
        return [
          "disabled" === n.initialNavigation
            ? Ms(3, [
                {
                  provide: Nl,
                  multi: !0,
                  useFactory: () => {
                    const t = te(it);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: pg, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === n.initialNavigation
            ? Ms(2, [
                { provide: pg, useValue: 0 },
                {
                  provide: Nl,
                  multi: !0,
                  deps: [Ne],
                  useFactory: (t) => {
                    const e = t.get(tN, Promise.resolve());
                    let r = !1;
                    return () =>
                      e.then(
                        () =>
                          new Promise((s) => {
                            const o = t.get(it),
                              a = t.get(CM);
                            (function i(s) {
                              t.get(it)
                                .events.pipe(
                                  Ze(
                                    (a) =>
                                      a instanceof li ||
                                      a instanceof zc ||
                                      a instanceof VS,
                                  ),
                                  U(
                                    (a) =>
                                      a instanceof li ||
                                      (a instanceof zc &&
                                        (0 === a.code || 1 === a.code) &&
                                        null),
                                  ),
                                  Ze((a) => null !== a),
                                  Tt(1),
                                )
                                .subscribe(() => {
                                  s();
                                });
                            })(() => {
                              s(!0), (r = !0);
                            }),
                              (o.afterPreactivation = () => (
                                s(!0), r || a.closed ? k(void 0) : a
                              )),
                              o.initialNavigation();
                          }),
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const SM = new w("");
      let MH = (() => {
          class n {
            constructor(e) {
              this.http = e;
            }
            ngOnInit() {}
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(ei));
            }),
            (n.ɵcmp = Ot({
              type: n,
              selectors: [["app-root"]],
              decls: 4,
              vars: 0,
              consts: [
                [1, "container"],
                [1, "row"],
                [1, "col-md-12"],
              ],
              template: function (e, r) {
                1 & e &&
                  (E(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  X(3, "router-outlet"),
                  S()()());
              },
              dependencies: [eg],
              styles: [
                ".container[_ngcontent-%COMP%]{margin-top:30px}.row[_ngcontent-%COMP%]{margin:20px 0}",
              ],
            })),
            n
          );
        })(),
        fa = (() => {
          class n {
            constructor(e) {
              (this.http = e),
                (this.stubs = []),
                (this.imposterArray = null),
                (this.predicates = []),
                (this.subPredicates = []),
                (this.responses = []);
            }
            setOperator(e) {
              this.subPredicates.push(e);
            }
            onGetPredicates() {
              return this.predicates.slice();
            }
            onGetResponses() {
              return this.responses.slice();
            }
            onAddPredicate({
              operator: e,
              method: r,
              path: i,
              newpath: s,
              data: o,
              newOperator: a,
              query: l,
            }) {
              this.predicates.push({
                operator: e,
                method: r,
                path: i,
                newpath: s,
                data: o,
                newOperator: a,
                query: l,
              });
            }
            onAddResponse({ statusCode: e, headers: r, body: i }) {
              this.responses.push({ statusCode: e, headers: r, body: i });
            }
            onResetPredicates() {
              this.predicates = [];
            }
            onResetResponses() {
              this.responses = [];
            }
            onDeletePredicate(e) {
              this.predicates.splice(e, 1);
            }
            onDeleteResponse(e) {
              this.responses.splice(e, 1);
            }
            onDeleteSubPredicate(e) {
              this.subPredicates.splice(e, 1);
            }
            onGetImposter() {
              let e = [];
              return (
                (this.imposterArray = this.http
                  .get("http://localhost:5000/imposters")
                  .pipe(
                    U((r) => {
                      (this.imposterArray = r),
                        (this.imposterArray = this.imposterArray.imposters);
                      for (let i = 0; i < this.imposterArray.length; i++)
                        this.http
                          .get(
                            `http://localhost:5000/imposters/${this.imposterArray[i].port}`,
                          )
                          .subscribe((s) => {
                            e.push(s), e.sort((o, a) => o.port - a.port);
                          });
                      return (this.imposterArray = e);
                    }),
                  )),
                this.imposterArray
              );
            }
            onViewImposter(e) {
              return this.http.get(`http://localhost:5000/imposters/${e}`);
            }
            onDeleteImposter(e, r) {
              this.http
                .delete(`http://localhost:5000/imposters/${e}`)
                .subscribe((i) => {
                  this.imposterArray.splice(r, 1);
                });
            }
            onCreateImposter(e) {
              const r = this.predicates.map((o) => {
                  const a = o.operator,
                    l = JSON.parse(o.query);
                  let c;
                  return (
                    (c = "other" == o.path ? o.newpath : o.path),
                    "or" === a || "and" === a
                      ? {
                          [a]: [
                            {
                              [o.newOperator]: {
                                method: o.method,
                                path: c,
                                data: o.data,
                              },
                            },
                          ],
                        }
                      : {
                          [a]: {
                            method: o.method,
                            path: c,
                            data: o.data,
                            query: l,
                          },
                        }
                  );
                }),
                i = this.responses.map((o) => ({
                  is: {
                    statusCode: o.statusCode,
                    headers: JSON.parse(o.headers),
                    body: JSON.parse(o.body),
                  },
                }));
              this.http
                .post("http://localhost:5000/imposters", {
                  port: e.port,
                  protocol: e.protocol,
                  name: e.name,
                  stubs: [{ predicates: r, responses: i }],
                })
                .subscribe(
                  (o) => {
                    this.imposterArray.push(o),
                      this.imposterArray.sort((a, l) => a.port - l.port);
                  },
                  (o) => {
                    console.error(o);
                  },
                );
            }
            onExportImposter(e) {
              this.http
                .get(`http://localhost:5000/imposters/${e}/_postman`, {
                  responseType: "text",
                })
                .subscribe((i) => {
                  const s = new Blob([i], { type: "application/json" }),
                    o = window.URL.createObjectURL(s),
                    a = document.createElement("a");
                  (a.href = o),
                    (a.download = `imposter-${e}.json`),
                    window.URL.revokeObjectURL(o);
                });
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(ei));
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })();
      const AH = ["mat-button", ""],
        TH = ["*"],
        RH = [
          "mat-button",
          "mat-flat-button",
          "mat-icon-button",
          "mat-raised-button",
          "mat-stroked-button",
          "mat-mini-fab",
          "mat-fab",
        ],
        xH = eS(
          JE(
            tS(
              class {
                constructor(n) {
                  this._elementRef = n;
                }
              },
            ),
          ),
        );
      let gg = (() => {
          class n extends xH {
            constructor(e, r, i) {
              super(e),
                (this._focusMonitor = r),
                (this._animationMode = i),
                (this.isRoundButton = this._hasHostAttributes(
                  "mat-fab",
                  "mat-mini-fab",
                )),
                (this.isIconButton =
                  this._hasHostAttributes("mat-icon-button"));
              for (const s of RH)
                this._hasHostAttributes(s) &&
                  this._getHostElement().classList.add(s);
              e.nativeElement.classList.add("mat-button-base"),
                this.isRoundButton && (this.color = "accent");
            }
            ngAfterViewInit() {
              this._focusMonitor.monitor(this._elementRef, !0);
            }
            ngOnDestroy() {
              this._focusMonitor.stopMonitoring(this._elementRef);
            }
            focus(e, r) {
              e
                ? this._focusMonitor.focusVia(this._getHostElement(), e, r)
                : this._getHostElement().focus(r);
            }
            _getHostElement() {
              return this._elementRef.nativeElement;
            }
            _isRippleDisabled() {
              return this.disableRipple || this.disabled;
            }
            _hasHostAttributes(...e) {
              return e.some((r) => this._getHostElement().hasAttribute(r));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Ie), _(kc), _(Io, 8));
            }),
            (n.ɵcmp = Ot({
              type: n,
              selectors: [
                ["button", "mat-button", ""],
                ["button", "mat-raised-button", ""],
                ["button", "mat-icon-button", ""],
                ["button", "mat-fab", ""],
                ["button", "mat-mini-fab", ""],
                ["button", "mat-stroked-button", ""],
                ["button", "mat-flat-button", ""],
              ],
              viewQuery: function (e, r) {
                if ((1 & e && Mo(Op, 5), 2 & e)) {
                  let i;
                  xn((i = On())) && (r.ripple = i.first);
                }
              },
              hostAttrs: [1, "mat-focus-indicator"],
              hostVars: 5,
              hostBindings: function (e, r) {
                2 & e &&
                  (et("disabled", r.disabled || null),
                  Jn(
                    "_mat-animation-noopable",
                    "NoopAnimations" === r._animationMode,
                  )("mat-button-disabled", r.disabled));
              },
              inputs: {
                disabled: "disabled",
                disableRipple: "disableRipple",
                color: "color",
              },
              exportAs: ["matButton"],
              features: [ne],
              attrs: AH,
              ngContentSelectors: TH,
              decls: 4,
              vars: 5,
              consts: [
                [1, "mat-button-wrapper"],
                [
                  "matRipple",
                  "",
                  1,
                  "mat-button-ripple",
                  3,
                  "matRippleDisabled",
                  "matRippleCentered",
                  "matRippleTrigger",
                ],
                [1, "mat-button-focus-overlay"],
              ],
              template: function (e, r) {
                1 & e &&
                  (mo(),
                  E(0, "span", 0),
                  _o(1),
                  S(),
                  X(2, "span", 1)(3, "span", 2)),
                  2 & e &&
                    (L(2),
                    Jn(
                      "mat-button-ripple-round",
                      r.isRoundButton || r.isIconButton,
                    ),
                    $("matRippleDisabled", r._isRippleDisabled())(
                      "matRippleCentered",
                      r.isIconButton,
                    )("matRippleTrigger", r._getHostElement()));
              },
              dependencies: [Op],
              styles: [
                ".mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{opacity:0}.mat-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay,.mat-stroked-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay{opacity:.04}@media(hover: none){.mat-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay,.mat-stroked-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay{opacity:0}}.mat-button,.mat-icon-button,.mat-stroked-button,.mat-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-button.mat-button-disabled,.mat-icon-button.mat-button-disabled,.mat-stroked-button.mat-button-disabled,.mat-flat-button.mat-button-disabled{cursor:default}.mat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-button.cdk-program-focused .mat-button-focus-overlay,.mat-icon-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-icon-button.cdk-program-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-program-focused .mat-button-focus-overlay,.mat-flat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-flat-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-raised-button::-moz-focus-inner{border:0}.mat-raised-button.mat-button-disabled{cursor:default}.mat-raised-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-raised-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-raised-button::-moz-focus-inner{border:0}._mat-animation-noopable.mat-raised-button{transition:none;animation:none}.mat-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.mat-stroked-button .mat-button-ripple.mat-ripple,.mat-stroked-button .mat-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.mat-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab::-moz-focus-inner{border:0}.mat-fab.mat-button-disabled{cursor:default}.mat-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-fab{transition:none;animation:none}.mat-fab .mat-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.mat-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab::-moz-focus-inner{border:0}.mat-mini-fab.mat-button-disabled{cursor:default}.mat-mini-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-mini-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-mini-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-mini-fab{transition:none;animation:none}.mat-mini-fab .mat-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button i,.mat-icon-button .mat-icon{line-height:24px}.mat-button-ripple.mat-ripple,.mat-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-button-ripple.mat-ripple:not(:empty){transform:translateZ(0)}.mat-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-button-focus-overlay{transition:none}.mat-button-ripple-round{border-radius:50%;z-index:1}.mat-button .mat-button-wrapper>*,.mat-flat-button .mat-button-wrapper>*,.mat-stroked-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-fab .mat-button-wrapper>*,.mat-mini-fab .mat-button-wrapper>*{vertical-align:middle}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button{display:inline-flex;justify-content:center;align-items:center;font-size:inherit;width:2.5em;height:2.5em}.cdk-high-contrast-active .mat-button,.cdk-high-contrast-active .mat-flat-button,.cdk-high-contrast-active .mat-raised-button,.cdk-high-contrast-active .mat-icon-button,.cdk-high-contrast-active .mat-fab,.cdk-high-contrast-active .mat-mini-fab{outline:solid 1px}.cdk-high-contrast-active .mat-button-base.cdk-keyboard-focused,.cdk-high-contrast-active .mat-button-base.cdk-program-focused{outline:solid 3px}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            n
          );
        })(),
        OH = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ imports: [[sS, Ln], Ln] })),
            n
          );
        })();
      const kH = ["*"];
      let iu;
      function pa(n) {
        return (
          (function FH() {
            if (void 0 === iu && ((iu = null), typeof window < "u")) {
              const n = window;
              void 0 !== n.trustedTypes &&
                (iu = n.trustedTypes.createPolicy("angular#components", {
                  createHTML: (t) => t,
                }));
            }
            return iu;
          })()?.createHTML(n) || n
        );
      }
      function MM(n) {
        return Error(`Unable to find icon with the name "${n}"`);
      }
      function AM(n) {
        return Error(
          `The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${n}".`,
        );
      }
      function TM(n) {
        return Error(
          `The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${n}".`,
        );
      }
      class ui {
        constructor(t, e, r) {
          (this.url = t), (this.svgText = e), (this.options = r);
        }
      }
      let su = (() => {
        class n {
          constructor(e, r, i, s) {
            (this._httpClient = e),
              (this._sanitizer = r),
              (this._errorHandler = s),
              (this._svgIconConfigs = new Map()),
              (this._iconSetConfigs = new Map()),
              (this._cachedIconsByUrl = new Map()),
              (this._inProgressUrlFetches = new Map()),
              (this._fontCssClassesByAlias = new Map()),
              (this._resolvers = []),
              (this._defaultFontSetClass = "material-icons"),
              (this._document = i);
          }
          addSvgIcon(e, r, i) {
            return this.addSvgIconInNamespace("", e, r, i);
          }
          addSvgIconLiteral(e, r, i) {
            return this.addSvgIconLiteralInNamespace("", e, r, i);
          }
          addSvgIconInNamespace(e, r, i, s) {
            return this._addSvgIconConfig(e, r, new ui(i, null, s));
          }
          addSvgIconResolver(e) {
            return this._resolvers.push(e), this;
          }
          addSvgIconLiteralInNamespace(e, r, i, s) {
            const o = this._sanitizer.sanitize(pe.HTML, i);
            if (!o) throw TM(i);
            const a = pa(o);
            return this._addSvgIconConfig(e, r, new ui("", a, s));
          }
          addSvgIconSet(e, r) {
            return this.addSvgIconSetInNamespace("", e, r);
          }
          addSvgIconSetLiteral(e, r) {
            return this.addSvgIconSetLiteralInNamespace("", e, r);
          }
          addSvgIconSetInNamespace(e, r, i) {
            return this._addSvgIconSetConfig(e, new ui(r, null, i));
          }
          addSvgIconSetLiteralInNamespace(e, r, i) {
            const s = this._sanitizer.sanitize(pe.HTML, r);
            if (!s) throw TM(r);
            const o = pa(s);
            return this._addSvgIconSetConfig(e, new ui("", o, i));
          }
          registerFontClassAlias(e, r = e) {
            return this._fontCssClassesByAlias.set(e, r), this;
          }
          classNameForFontAlias(e) {
            return this._fontCssClassesByAlias.get(e) || e;
          }
          setDefaultFontSetClass(e) {
            return (this._defaultFontSetClass = e), this;
          }
          getDefaultFontSetClass() {
            return this._defaultFontSetClass;
          }
          getSvgIconFromUrl(e) {
            const r = this._sanitizer.sanitize(pe.RESOURCE_URL, e);
            if (!r) throw AM(e);
            const i = this._cachedIconsByUrl.get(r);
            return i
              ? k(ou(i))
              : this._loadSvgIconFromConfig(new ui(e, null)).pipe(
                  $e((s) => this._cachedIconsByUrl.set(r, s)),
                  U((s) => ou(s)),
                );
          }
          getNamedSvgIcon(e, r = "") {
            const i = IM(r, e);
            let s = this._svgIconConfigs.get(i);
            if (s) return this._getSvgFromConfig(s);
            if (((s = this._getIconConfigFromResolvers(r, e)), s))
              return this._svgIconConfigs.set(i, s), this._getSvgFromConfig(s);
            const o = this._iconSetConfigs.get(r);
            return o ? this._getSvgFromIconSetConfigs(e, o) : ii(MM(i));
          }
          ngOnDestroy() {
            (this._resolvers = []),
              this._svgIconConfigs.clear(),
              this._iconSetConfigs.clear(),
              this._cachedIconsByUrl.clear();
          }
          _getSvgFromConfig(e) {
            return e.svgText
              ? k(ou(this._svgElementFromConfig(e)))
              : this._loadSvgIconFromConfig(e).pipe(U((r) => ou(r)));
          }
          _getSvgFromIconSetConfigs(e, r) {
            const i = this._extractIconWithNameFromAnySet(e, r);
            return i
              ? k(i)
              : ZD(
                  r
                    .filter((o) => !o.svgText)
                    .map((o) =>
                      this._loadSvgIconSetFromConfig(o).pipe(
                        Rr((a) => {
                          const c = `Loading icon set URL: ${this._sanitizer.sanitize(pe.RESOURCE_URL, o.url)} failed: ${a.message}`;
                          return (
                            this._errorHandler.handleError(new Error(c)),
                            k(null)
                          );
                        }),
                      ),
                    ),
                ).pipe(
                  U(() => {
                    const o = this._extractIconWithNameFromAnySet(e, r);
                    if (!o) throw MM(e);
                    return o;
                  }),
                );
          }
          _extractIconWithNameFromAnySet(e, r) {
            for (let i = r.length - 1; i >= 0; i--) {
              const s = r[i];
              if (s.svgText && s.svgText.toString().indexOf(e) > -1) {
                const o = this._svgElementFromConfig(s),
                  a = this._extractSvgIconFromSet(o, e, s.options);
                if (a) return a;
              }
            }
            return null;
          }
          _loadSvgIconFromConfig(e) {
            return this._fetchIcon(e).pipe(
              $e((r) => (e.svgText = r)),
              U(() => this._svgElementFromConfig(e)),
            );
          }
          _loadSvgIconSetFromConfig(e) {
            return e.svgText
              ? k(null)
              : this._fetchIcon(e).pipe($e((r) => (e.svgText = r)));
          }
          _extractSvgIconFromSet(e, r, i) {
            const s = e.querySelector(`[id="${r}"]`);
            if (!s) return null;
            const o = s.cloneNode(!0);
            if ((o.removeAttribute("id"), "svg" === o.nodeName.toLowerCase()))
              return this._setSvgAttributes(o, i);
            if ("symbol" === o.nodeName.toLowerCase())
              return this._setSvgAttributes(this._toSvgElement(o), i);
            const a = this._svgElementFromString(pa("<svg></svg>"));
            return a.appendChild(o), this._setSvgAttributes(a, i);
          }
          _svgElementFromString(e) {
            const r = this._document.createElement("DIV");
            r.innerHTML = e;
            const i = r.querySelector("svg");
            if (!i) throw Error("<svg> tag not found");
            return i;
          }
          _toSvgElement(e) {
            const r = this._svgElementFromString(pa("<svg></svg>")),
              i = e.attributes;
            for (let s = 0; s < i.length; s++) {
              const { name: o, value: a } = i[s];
              "id" !== o && r.setAttribute(o, a);
            }
            for (let s = 0; s < e.childNodes.length; s++)
              e.childNodes[s].nodeType === this._document.ELEMENT_NODE &&
                r.appendChild(e.childNodes[s].cloneNode(!0));
            return r;
          }
          _setSvgAttributes(e, r) {
            return (
              e.setAttribute("fit", ""),
              e.setAttribute("height", "100%"),
              e.setAttribute("width", "100%"),
              e.setAttribute("preserveAspectRatio", "xMidYMid meet"),
              e.setAttribute("focusable", "false"),
              r && r.viewBox && e.setAttribute("viewBox", r.viewBox),
              e
            );
          }
          _fetchIcon(e) {
            const { url: r, options: i } = e,
              s = i?.withCredentials ?? !1;
            if (!this._httpClient)
              throw (function PH() {
                return Error(
                  "Could not find HttpClient provider for use with Angular Material icons. Please include the HttpClientModule from @angular/common/http in your app imports.",
                );
              })();
            if (null == r) throw Error(`Cannot fetch icon from URL "${r}".`);
            const o = this._sanitizer.sanitize(pe.RESOURCE_URL, r);
            if (!o) throw AM(r);
            const a = this._inProgressUrlFetches.get(o);
            if (a) return a;
            const l = this._httpClient
              .get(o, { responseType: "text", withCredentials: s })
              .pipe(
                U((c) => pa(c)),
                Lc(() => this._inProgressUrlFetches.delete(o)),
                ym(),
              );
            return this._inProgressUrlFetches.set(o, l), l;
          }
          _addSvgIconConfig(e, r, i) {
            return this._svgIconConfigs.set(IM(e, r), i), this;
          }
          _addSvgIconSetConfig(e, r) {
            const i = this._iconSetConfigs.get(e);
            return i ? i.push(r) : this._iconSetConfigs.set(e, [r]), this;
          }
          _svgElementFromConfig(e) {
            if (!e.svgElement) {
              const r = this._svgElementFromString(e.svgText);
              this._setSvgAttributes(r, e.options), (e.svgElement = r);
            }
            return e.svgElement;
          }
          _getIconConfigFromResolvers(e, r) {
            for (let i = 0; i < this._resolvers.length; i++) {
              const s = this._resolvers[i](r, e);
              if (s)
                return LH(s) ? new ui(s.url, null, s.options) : new ui(s, null);
            }
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(ei, 8), m(Uf), m(Y, 8), m(Yn));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function ou(n) {
        return n.cloneNode(!0);
      }
      function IM(n, t) {
        return n + ":" + t;
      }
      function LH(n) {
        return !(!n.url || !n.options);
      }
      const VH = eS(
          class {
            constructor(n) {
              this._elementRef = n;
            }
          },
        ),
        BH = new w("mat-icon-location", {
          providedIn: "root",
          factory: function jH() {
            const n = te(Y),
              t = n ? n.location : null;
            return { getPathname: () => (t ? t.pathname + t.search : "") };
          },
        }),
        RM = [
          "clip-path",
          "color-profile",
          "src",
          "cursor",
          "fill",
          "filter",
          "marker",
          "marker-start",
          "marker-mid",
          "marker-end",
          "mask",
          "stroke",
        ],
        UH = RM.map((n) => `[${n}]`).join(", "),
        HH = /^url\(['"]?#(.*?)['"]?\)$/;
      let au = (() => {
          class n extends VH {
            constructor(e, r, i, s, o) {
              super(e),
                (this._iconRegistry = r),
                (this._location = s),
                (this._errorHandler = o),
                (this._inline = !1),
                (this._currentIconFetch = ue.EMPTY),
                i || e.nativeElement.setAttribute("aria-hidden", "true");
            }
            get inline() {
              return this._inline;
            }
            set inline(e) {
              this._inline = Wo(e);
            }
            get svgIcon() {
              return this._svgIcon;
            }
            set svgIcon(e) {
              e !== this._svgIcon &&
                (e
                  ? this._updateSvgIcon(e)
                  : this._svgIcon && this._clearSvgElement(),
                (this._svgIcon = e));
            }
            get fontSet() {
              return this._fontSet;
            }
            set fontSet(e) {
              const r = this._cleanupFontValue(e);
              r !== this._fontSet &&
                ((this._fontSet = r), this._updateFontIconClasses());
            }
            get fontIcon() {
              return this._fontIcon;
            }
            set fontIcon(e) {
              const r = this._cleanupFontValue(e);
              r !== this._fontIcon &&
                ((this._fontIcon = r), this._updateFontIconClasses());
            }
            _splitIconName(e) {
              if (!e) return ["", ""];
              const r = e.split(":");
              switch (r.length) {
                case 1:
                  return ["", r[0]];
                case 2:
                  return r;
                default:
                  throw Error(`Invalid icon name: "${e}"`);
              }
            }
            ngOnInit() {
              this._updateFontIconClasses();
            }
            ngAfterViewChecked() {
              const e = this._elementsWithExternalReferences;
              if (e && e.size) {
                const r = this._location.getPathname();
                r !== this._previousPath &&
                  ((this._previousPath = r), this._prependPathToReferences(r));
              }
            }
            ngOnDestroy() {
              this._currentIconFetch.unsubscribe(),
                this._elementsWithExternalReferences &&
                  this._elementsWithExternalReferences.clear();
            }
            _usingFontIcon() {
              return !this.svgIcon;
            }
            _setSvgElement(e) {
              this._clearSvgElement();
              const r = e.querySelectorAll("style");
              for (let s = 0; s < r.length; s++) r[s].textContent += " ";
              const i = this._location.getPathname();
              (this._previousPath = i),
                this._cacheChildrenWithExternalReferences(e),
                this._prependPathToReferences(i),
                this._elementRef.nativeElement.appendChild(e);
            }
            _clearSvgElement() {
              const e = this._elementRef.nativeElement;
              let r = e.childNodes.length;
              for (
                this._elementsWithExternalReferences &&
                this._elementsWithExternalReferences.clear();
                r--;

              ) {
                const i = e.childNodes[r];
                (1 !== i.nodeType || "svg" === i.nodeName.toLowerCase()) &&
                  i.remove();
              }
            }
            _updateFontIconClasses() {
              if (!this._usingFontIcon()) return;
              const e = this._elementRef.nativeElement,
                r = this.fontSet
                  ? this._iconRegistry.classNameForFontAlias(this.fontSet)
                  : this._iconRegistry.getDefaultFontSetClass();
              r != this._previousFontSetClass &&
                (this._previousFontSetClass &&
                  e.classList.remove(this._previousFontSetClass),
                r && e.classList.add(r),
                (this._previousFontSetClass = r)),
                this.fontIcon != this._previousFontIconClass &&
                  (this._previousFontIconClass &&
                    e.classList.remove(this._previousFontIconClass),
                  this.fontIcon && e.classList.add(this.fontIcon),
                  (this._previousFontIconClass = this.fontIcon));
            }
            _cleanupFontValue(e) {
              return "string" == typeof e ? e.trim().split(" ")[0] : e;
            }
            _prependPathToReferences(e) {
              const r = this._elementsWithExternalReferences;
              r &&
                r.forEach((i, s) => {
                  i.forEach((o) => {
                    s.setAttribute(o.name, `url('${e}#${o.value}')`);
                  });
                });
            }
            _cacheChildrenWithExternalReferences(e) {
              const r = e.querySelectorAll(UH),
                i = (this._elementsWithExternalReferences =
                  this._elementsWithExternalReferences || new Map());
              for (let s = 0; s < r.length; s++)
                RM.forEach((o) => {
                  const a = r[s],
                    l = a.getAttribute(o),
                    c = l ? l.match(HH) : null;
                  if (c) {
                    let u = i.get(a);
                    u || ((u = []), i.set(a, u)),
                      u.push({ name: o, value: c[1] });
                  }
                });
            }
            _updateSvgIcon(e) {
              if (
                ((this._svgNamespace = null),
                (this._svgName = null),
                this._currentIconFetch.unsubscribe(),
                e)
              ) {
                const [r, i] = this._splitIconName(e);
                r && (this._svgNamespace = r),
                  i && (this._svgName = i),
                  (this._currentIconFetch = this._iconRegistry
                    .getNamedSvgIcon(i, r)
                    .pipe(Tt(1))
                    .subscribe(
                      (s) => this._setSvgElement(s),
                      (s) => {
                        this._errorHandler.handleError(
                          new Error(
                            `Error retrieving icon ${r}:${i}! ${s.message}`,
                          ),
                        );
                      },
                    ));
              }
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                _(Ie),
                _(su),
                Ri("aria-hidden"),
                _(BH),
                _(Yn),
              );
            }),
            (n.ɵcmp = Ot({
              type: n,
              selectors: [["mat-icon"]],
              hostAttrs: ["role", "img", 1, "mat-icon", "notranslate"],
              hostVars: 7,
              hostBindings: function (e, r) {
                2 & e &&
                  (et(
                    "data-mat-icon-type",
                    r._usingFontIcon() ? "font" : "svg",
                  )("data-mat-icon-name", r._svgName || r.fontIcon)(
                    "data-mat-icon-namespace",
                    r._svgNamespace || r.fontSet,
                  ),
                  Jn("mat-icon-inline", r.inline)(
                    "mat-icon-no-color",
                    "primary" !== r.color &&
                      "accent" !== r.color &&
                      "warn" !== r.color,
                  ));
              },
              inputs: {
                color: "color",
                inline: "inline",
                svgIcon: "svgIcon",
                fontSet: "fontSet",
                fontIcon: "fontIcon",
              },
              exportAs: ["matIcon"],
              features: [ne],
              ngContentSelectors: kH,
              decls: 1,
              vars: 0,
              template: function (e, r) {
                1 & e && (mo(), _o(0));
              },
              styles: [
                ".mat-icon{-webkit-user-select:none;-moz-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            n
          );
        })(),
        $H = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({ imports: [[Ln], Ln] })),
            n
          );
        })();
      const zH = ["options"];
      function GH(n, t) {
        if ((1 & n && (E(0, "option", 22), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e.name), L(1), nt(e.name);
        }
      }
      function WH(n, t) {
        if ((1 & n && (E(0, "option", 22), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e.name), L(1), nt(e.name);
        }
      }
      function qH(n, t) {
        if ((1 & n && (E(0, "option", 22), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e), L(1), nt(e);
        }
      }
      let KH = (() => {
        class n {
          constructor(e, r) {
            (this.imposterService = e),
              (this.formBuilder = r),
              (this.index = 0),
              (this.predicate = {
                operator: "",
                method: "",
                path: "",
                newpath: "",
                data: "",
                newOperator: "",
                query: "",
              }),
              (this.showEdit = !1),
              (this.beneficiaryUpdate = new ae()),
              (this.editUpdate = new ae()),
              (this.deleteUpdate = new ae()),
              (this.genericPath = ["/customer", "/user", "other"]),
              (this.operator = [
                { name: "equals" },
                { name: "deepEquals" },
                { name: "contains" },
                { name: "startsWith" },
                { name: "endsWith" },
                { name: "matches" },
                { name: "exists" },
                { name: "not" },
                { name: "or" },
                { name: "and" },
                { name: "inject" },
              ]),
              (this.newOperator = [
                { name: "equals" },
                { name: "deepEquals" },
                { name: "contains" },
                { name: "startsWith" },
                { name: "endsWith" },
                { name: "matches" },
                { name: "exists" },
                { name: "inject" },
              ]),
              (this.predicateForm = this.formBuilder.group({
                operator: [""],
                method: [""],
                path: [""],
                newpath: [""],
                data: [""],
                newOperator: [""],
                query: [""],
              })),
              (this.subPredicates = []),
              (this.showPredicates = !1),
              (this.showSubPredicates = !1);
          }
          ngOnInit() {
            this.predicateForm.setValue({
              operator: this.predicate.operator,
              method: this.predicate.method,
              path: this.predicate.path,
              newpath: this.predicate.newpath,
              query: this.predicate.query,
              data: this.predicate.data,
              newOperator: this.predicate.newOperator,
            }),
              this.predicateForm.valueChanges.subscribe(() => {
                this.updatePredicates();
              });
          }
          onSubmit() {}
          onDelete() {
            this.deleteUpdate.emit(this.index);
          }
          deleteSubPredicateUpdate(e) {
            let r = [];
            for (let i = 0; i < this.subPredicates.length; i++)
              i !== e && r.push(this.subPredicates[i]);
            (this.subPredicates = r),
              this.imposterService.onDeleteSubPredicate(e),
              (this.subPredicates = this.imposterService.onGetPredicates());
          }
          updatePredicates() {
            const e = this.predicateForm.get("operator").value,
              r = this.predicateForm.get("method").value,
              i = this.predicateForm.get("path").value,
              s = this.predicateForm.get("newpath").value,
              o = this.predicateForm.get("data").value,
              a = this.predicateForm.get("newOperator").value,
              l = this.predicateForm.get("query").value;
            (this.predicate.operator = e),
              (this.predicate.method = r),
              (this.predicate.path = i),
              (this.predicate.newpath = s),
              (this.predicate.data = o),
              (this.predicate.newOperator = a),
              (this.predicate.query = l);
            const c = this.imposterService
              .onGetPredicates()
              .findIndex(
                (u) =>
                  u.method === r &&
                  u.query === l &&
                  u.path === i &&
                  u.newpath === s &&
                  u.data === o &&
                  u.newOperator === a,
              );
            c > -1
              ? (this.imposterService.onGetPredicates()[c] = this.predicate)
              : this.imposterService.onGetPredicates().push(this.predicate);
          }
          selectHideData() {
            "equals" == this.options.nativeElement.value ||
            "deepEquals" == this.options.nativeElement.value ||
            "and" == this.options.nativeElement.value ||
            "equals" == this.options.nativeElement.value
              ? this.predicateForm.controls.data.disable()
              : this.predicateForm.controls.data.enable();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(fa), _(sp));
          }),
          (n.ɵcmp = Ot({
            type: n,
            selectors: [["app-predicates"]],
            viewQuery: function (e, r) {
              if ((1 & e && Mo(zH, 5), 2 & e)) {
                let i;
                xn((i = On())) && (r.options = i.first);
              }
            },
            inputs: {
              index: "index",
              predicate: "predicate",
              showEdit: "showEdit",
            },
            outputs: {
              beneficiaryUpdate: "beneficiaryUpdate",
              editUpdate: "editUpdate",
              deleteUpdate: "deleteUpdate",
            },
            decls: 57,
            vars: 6,
            consts: [
              [3, "formGroup", "ngSubmit"],
              [
                2,
                "border",
                "1px solid #ccc",
                "border-radius",
                "10px",
                "background-color",
                "#dcdcdc",
              ],
              [
                2,
                "display",
                "flex",
                "justify-content",
                "flex-start",
                "align-items",
                "center",
                "padding-right",
                "5px",
                "padding-top",
                "5px",
              ],
              [
                2,
                "margin-right",
                "auto",
                "padding-left",
                "15px",
                "padding-top",
                "5px",
                "font-weight",
                "bold",
              ],
              ["mat-icon-button", "", "color", "basic", 3, "click"],
              [
                2,
                "padding-bottom",
                "30px",
                "padding-left",
                "30px",
                "padding-right",
                "30px",
              ],
              [
                "name",
                "operator",
                "required",
                "",
                "formControlName",
                "operator",
                1,
                "form-control",
              ],
              ["options", ""],
              [3, "value", 4, "ngFor", "ngForOf"],
              [3, "hidden"],
              [
                "name",
                "newOperator",
                "required",
                "",
                "formControlName",
                "newOperator",
                1,
                "form-control",
              ],
              ["secondOperator", ""],
              ["type", "text", "formControlName", "data", 1, "form-control"],
              [
                "name",
                "method",
                "required",
                "",
                "formControlName",
                "method",
                1,
                "form-control",
              ],
              ["value", "GET"],
              ["value", "POST"],
              ["value", "PUT"],
              ["value", "DELETE"],
              ["name", "path", "formControlName", "path", 1, "form-control"],
              ["path", ""],
              [
                "type",
                "text",
                "name",
                "newpath",
                "required",
                "",
                "formControlName",
                "newpath",
                1,
                "form-control",
              ],
              [
                "type",
                "text",
                "name",
                "query",
                "required",
                "",
                "formControlName",
                "query",
                1,
                "form-control",
              ],
              [3, "value"],
            ],
            template: function (e, r) {
              if (
                (1 & e &&
                  (E(0, "form", 0),
                  oe("ngSubmit", function () {
                    return r.onSubmit();
                  }),
                  E(1, "div", 1)(2, "div", 2)(3, "h3", 3),
                  x(4, "New Predicate"),
                  S(),
                  E(5, "button", 4),
                  oe("click", function () {
                    return r.onDelete();
                  }),
                  E(6, "mat-icon"),
                  x(7, "close"),
                  S()()(),
                  E(8, "div", 5)(9, "div")(10, "label"),
                  x(11, "Operator:"),
                  S(),
                  E(12, "select", 6, 7),
                  Xe(14, GH, 2, 2, "option", 8),
                  S()(),
                  E(15, "div", 9),
                  X(16, "br"),
                  E(17, "label"),
                  x(18, "Select Operator to compare: "),
                  S(),
                  E(19, "select", 10, 11),
                  Xe(21, WH, 2, 2, "option", 8),
                  S()(),
                  X(22, "br"),
                  E(23, "div")(24, "label"),
                  x(25, "Data:"),
                  S(),
                  X(26, "input", 12),
                  S(),
                  X(27, "br"),
                  E(28, "div")(29, "label"),
                  x(30, "Method:"),
                  S(),
                  E(31, "select", 13)(32, "option", 14),
                  x(33, "GET"),
                  S(),
                  E(34, "option", 15),
                  x(35, "POST"),
                  S(),
                  E(36, "option", 16),
                  x(37, "PUT"),
                  S(),
                  E(38, "option", 17),
                  x(39, "DELETE"),
                  S()()(),
                  X(40, "br"),
                  E(41, "div")(42, "label"),
                  x(43, "Path:"),
                  S(),
                  X(44, "br"),
                  E(45, "select", 18, 19),
                  Xe(47, qH, 2, 2, "option", 8),
                  S(),
                  E(48, "div", 9),
                  X(49, "br")(50, "input", 20),
                  S()(),
                  X(51, "br"),
                  E(52, "div")(53, "label"),
                  x(54, "Query:"),
                  S(),
                  X(55, "input", 21),
                  S()()()(),
                  X(56, "br")),
                2 & e)
              ) {
                const i = po(13),
                  s = po(46);
                $("formGroup", r.predicateForm),
                  L(14),
                  $("ngForOf", r.operator),
                  L(1),
                  $("hidden", !("or" == i.value || "and" == i.value)),
                  L(6),
                  $("ngForOf", r.newOperator),
                  L(26),
                  $("ngForOf", r.genericPath),
                  L(1),
                  $("hidden", "other" != s.value);
              }
            },
            dependencies: [Fo, vc, bc, Cc, us, fs, cc, uc, ps, gg, au, hs, zo],
          })),
          n
        );
      })();
      function YH(n, t) {
        if ((1 & n && (E(0, "option", 19), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e), L(1), nt(e);
        }
      }
      function ZH(n, t) {
        if ((1 & n && (E(0, "option", 19), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e), L(1), nt(e);
        }
      }
      function QH(n, t) {
        if ((1 & n && (E(0, "option", 19), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e), L(1), br("", e, " ");
        }
      }
      function XH(n, t) {
        if ((1 & n && (E(0, "option", 19), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e), L(1), br(" ", e, "");
        }
      }
      function JH(n, t) {
        if ((1 & n && (E(0, "option", 19), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e), L(1), br("", e, " ");
        }
      }
      function e$(n, t) {
        if ((1 & n && (E(0, "option", 19), x(1), S()), 2 & n)) {
          const e = t.$implicit;
          $("value", e), L(1), br("", e, " ");
        }
      }
      function t$(n, t) {
        if (
          (1 & n &&
            (E(0, "option", 19), xl(1, "json"), x(2), xl(3, "json"), S()),
          2 & n)
        ) {
          const e = t.$implicit;
          $("value", Ol(1, 2, e)), L(2), nt(Ol(3, 4, e));
        }
      }
      let n$ = (() => {
        class n {
          constructor(e, r) {
            (this.formBuilder = e),
              (this.imposterService = r),
              (this.index = 0),
              (this.responseIndex = 0),
              (this.response = { statusCode: "", headers: "", body: "" }),
              (this.deleteUpdate = new ae()),
              (this.deleteResponseUpdate = new ae()),
              (this.statusCode = [
                "Informational responses (100 to 199)",
                "Successful responses (200 to 299)",
                "Redirection messages (300 to 399)",
                "Client error responses (400 to 499)",
                "Server error responses (500 to 599)",
              ]),
              (this.informationRes = ["100", "101", "102", "103"]),
              (this.successRes = [
                "200",
                "201",
                "202",
                "203",
                "204",
                "205",
                "206",
                "207",
                "208",
                "226",
              ]),
              (this.redirectionRes = [
                "300",
                "301",
                "302",
                "303",
                "304",
                "305",
                "306",
                "307",
                "308",
              ]),
              (this.clientErrRes = [
                "400",
                "401",
                "402",
                "403",
                "404",
                "405",
                "406",
                "407",
                "408",
                "409",
                "410",
                "411",
                "412",
                "413",
                "414",
                "415",
                "416",
                "417",
                "418",
                "421",
                "422",
                "423",
                "424",
                "425",
                "426",
                "428",
                "429",
                "431",
                "451",
              ]),
              (this.serverErrRes = [
                "500",
                "501",
                "502",
                "503",
                "504",
                "505",
                "506",
                "507",
                "508",
                "510",
                "511",
              ]),
              (this.headers = [{ "Content-Type": "application/json" }]),
              (this.responseForm = this.formBuilder.group({
                statusCode: 0,
                infoCode: [""],
                successCode: [""],
                redirectCode: [""],
                clientCode: [""],
                serverCode: [""],
                headers: [""],
                body: [""],
              }));
          }
          ngOnInit() {
            this.responseForm.setValue({
              statusCode: this.response.statusCode,
              infoCode: "",
              successCode: "",
              redirectCode: "",
              clientCode: "",
              serverCode: "",
              headers: this.response.headers,
              body: this.response.body,
            }),
              this.responseForm.valueChanges.subscribe(() => {
                this.updateResponses();
              });
          }
          onSubmit() {}
          onDelete() {
            this.deleteResponseUpdate.emit(this.responseIndex),
              (this.hideCloseButton = !(
                this.imposterService.onGetResponses().length > 1
              ));
          }
          updateResponses() {
            const e = this.responseForm.get("statusCode").value,
              r = Number(this.responseForm.get("infoCode").value),
              i = Number(this.responseForm.get("successCode").value),
              s = Number(this.responseForm.get("redirectCode").value),
              o = Number(this.responseForm.get("clientCode").value),
              a = Number(this.responseForm.get("serverCode").value),
              l = this.responseForm.get("headers").value,
              c = this.responseForm.get("body").value;
            r && (this.response.statusCode = r),
              i && (this.response.statusCode = i),
              s && (this.response.statusCode = s),
              o && (this.response.statusCode = o),
              a && (this.response.statusCode = a),
              (this.response.headers = l),
              (this.response.body = c);
            const u = this.imposterService
              .onGetResponses()
              .findIndex(
                (d) => d.statusCode === e && d.headers === l && d.body === c,
              );
            u > -1
              ? (this.imposterService.onGetResponses()[u] = this.response)
              : this.imposterService.onGetResponses().push(this.response);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(sp), _(fa));
          }),
          (n.ɵcmp = Ot({
            type: n,
            selectors: [["app-responses"]],
            inputs: {
              index: "index",
              responseIndex: "responseIndex",
              response: "response",
              hideCloseButton: "hideCloseButton",
            },
            outputs: {
              deleteUpdate: "deleteUpdate",
              deleteResponseUpdate: "deleteResponseUpdate",
            },
            decls: 52,
            vars: 13,
            consts: [
              [3, "formGroup", "ngSubmit"],
              [
                2,
                "border",
                "1px solid #ccc",
                "border-radius",
                "10px",
                "background-color",
                "#dcdcdc",
              ],
              [
                2,
                "display",
                "flex",
                "justify-content",
                "flex-start",
                "align-items",
                "center",
                "padding-right",
                "5px",
                "padding-top",
                "5px",
              ],
              [
                2,
                "margin-right",
                "auto",
                "padding-left",
                "15px",
                "padding-top",
                "5px",
                "font-weight",
                "bold",
              ],
              ["mat-icon-button", "", "color", "basic", 3, "click"],
              [
                2,
                "padding-bottom",
                "30px",
                "padding-left",
                "30px",
                "padding-right",
                "30px",
              ],
              [
                "name",
                "statusCode",
                "formControlName",
                "statusCode",
                1,
                "form-control",
              ],
              ["code", ""],
              ["value", "select option"],
              [3, "value", 4, "ngFor", "ngForOf"],
              [3, "hidden"],
              [
                "name",
                "infoRes",
                "formControlName",
                "infoCode",
                1,
                "form-control",
              ],
              [
                "name",
                "succRes",
                "formControlName",
                "successCode",
                1,
                "form-control",
              ],
              [
                "name",
                "redRes",
                "formControlName",
                "redirectCode",
                1,
                "form-control",
              ],
              [
                "name",
                "cliRes",
                "formControlName",
                "clientCode",
                1,
                "form-control",
              ],
              [
                "name",
                "serverRes",
                "formControlName",
                "serverCode",
                1,
                "form-control",
              ],
              [
                "name",
                "headers",
                "formControlName",
                "headers",
                1,
                "form-control",
              ],
              ["path", ""],
              [
                "name",
                "body",
                "required",
                "",
                "formControlName",
                "body",
                1,
                "form-control",
                2,
                "resize",
                "none",
              ],
              [3, "value"],
            ],
            template: function (e, r) {
              if (
                (1 & e &&
                  (E(0, "form", 0),
                  oe("ngSubmit", function () {
                    return r.onSubmit();
                  }),
                  E(1, "div", 1)(2, "div", 2)(3, "h3", 3),
                  x(4, "New Response"),
                  S(),
                  E(5, "div")(6, "button", 4),
                  oe("click", function () {
                    return r.onDelete();
                  }),
                  E(7, "mat-icon"),
                  x(8, "close"),
                  S()()()(),
                  E(9, "div", 5)(10, "div")(11, "label"),
                  x(12, "Status Code:"),
                  S(),
                  E(13, "select", 6, 7)(15, "option", 8),
                  x(16, "Please select an option"),
                  S(),
                  Xe(17, YH, 2, 2, "option", 9),
                  S(),
                  E(18, "div", 10),
                  X(19, "br"),
                  E(20, "select", 11),
                  Xe(21, ZH, 2, 2, "option", 9),
                  S()(),
                  E(22, "div", 10),
                  X(23, "br"),
                  E(24, "select", 12),
                  Xe(25, QH, 2, 2, "option", 9),
                  S()(),
                  E(26, "div", 10),
                  X(27, "br"),
                  E(28, "select", 13),
                  Xe(29, XH, 2, 2, "option", 9),
                  S()(),
                  E(30, "div", 10),
                  X(31, "br"),
                  E(32, "select", 14),
                  Xe(33, JH, 2, 2, "option", 9),
                  S()(),
                  E(34, "div", 10),
                  X(35, "br"),
                  E(36, "select", 15),
                  Xe(37, e$, 2, 2, "option", 9),
                  S()()(),
                  X(38, "br"),
                  E(39, "div")(40, "label"),
                  x(41, "Headers:"),
                  S(),
                  X(42, "br"),
                  E(43, "select", 16, 17),
                  Xe(45, t$, 4, 6, "option", 9),
                  S()(),
                  X(46, "br"),
                  E(47, "div")(48, "label"),
                  x(49, "Body:"),
                  S(),
                  X(50, "textarea", 18),
                  S()()()(),
                  X(51, "br")),
                2 & e)
              ) {
                const i = po(14);
                $("formGroup", r.responseForm),
                  L(17),
                  $("ngForOf", r.statusCode),
                  L(1),
                  $(
                    "hidden",
                    "Informational responses (100 to 199)" != i.value,
                  ),
                  L(3),
                  $("ngForOf", r.informationRes),
                  L(1),
                  $("hidden", "Successful responses (200 to 299)" != i.value),
                  L(3),
                  $("ngForOf", r.successRes),
                  L(1),
                  $("hidden", "Redirection messages (300 to 399)" != i.value),
                  L(3),
                  $("ngForOf", r.redirectionRes),
                  L(1),
                  $("hidden", "Client error responses (400 to 499)" != i.value),
                  L(3),
                  $("ngForOf", r.clientErrRes),
                  L(1),
                  $("hidden", "Server error responses (500 to 599)" != i.value),
                  L(3),
                  $("ngForOf", r.serverErrRes),
                  L(8),
                  $("ngForOf", r.headers);
              }
            },
            dependencies: [
              Fo,
              vc,
              bc,
              Cc,
              us,
              fs,
              cc,
              uc,
              ps,
              gg,
              au,
              hs,
              zo,
              Rf,
            ],
          })),
          n
        );
      })();
      function r$(n, t) {
        if (1 & n) {
          const e = es();
          E(0, "div")(1, "app-predicates", 20),
            oe("editUpdate", function (i) {
              return Et(e), St(tt().editUpdate(i));
            })("deleteUpdate", function (i) {
              return Et(e), St(tt().deleteUpdate(i));
            }),
            S()();
        }
        if (2 & n) {
          const e = t.$implicit,
            r = t.index;
          L(1), $("index", r)("predicate", e);
        }
      }
      function i$(n, t) {
        if (1 & n) {
          const e = es();
          E(0, "div")(1, "app-responses", 21),
            oe("editUpdate", function (i) {
              return Et(e), St(tt().editUpdate(i));
            })("deleteResponseUpdate", function (i) {
              return Et(e), St(tt().deleteResponseUpdate(i));
            }),
            S()();
        }
        if (2 & n) {
          const e = t.$implicit,
            r = t.index,
            i = tt();
          L(1),
            $("responseIndex", r)("response", e)(
              "hideCloseButton",
              i.hideCloseButton,
            );
        }
      }
      let s$ = (() => {
        class n {
          constructor(e, r, i, s) {
            (this.http = e),
              (this.fb = r),
              (this.matDialogRef = i),
              (this.imposterService = s),
              (this.protocols = ["http", "https", "tcp"]),
              (this.methods = ["GET", "POST", "PUT"]),
              (this.stubs = []),
              (this.predicates = []),
              (this.responses = []),
              (this.showEdit = []),
              (this.hideCloseButton = !0),
              (this.index = 0),
              (this.indexResponse = 0),
              (this.dependencyForm = this.fb.group({
                name: [""],
                port: [""],
                protocol: [""],
              }));
          }
          ngOnInit() {
            this.imposterService.onResetPredicates(),
              this.imposterService.onResetResponses(),
              0 === this.imposterService.onGetPredicates().length &&
                this.imposterService.onAddPredicate({
                  operator: "",
                  method: "",
                  path: "",
                  newpath: "",
                  data: "",
                  newOperator: "",
                  query: "",
                }),
              0 === this.imposterService.onGetResponses().length &&
                this.imposterService.onAddResponse({
                  statusCode: "",
                  headers: "",
                  body: "",
                }),
              (this.predicates = this.imposterService.onGetPredicates()),
              (this.responses = this.imposterService.onGetResponses());
          }
          predicateUpdate(e) {
            (this.showEdit[e.index] = !0), (this.predicates[e.index] = e.value);
          }
          closeModal() {
            this.matDialogRef.close();
          }
          onSubmit() {
            this.imposterService.onCreateImposter(this.dependencyForm.value),
              this.matDialogRef.close();
          }
          addPredicate() {
            this.imposterService.onAddPredicate({
              operator: "",
              method: "",
              path: "",
              newpath: "",
              data: "",
              newOperator: "",
              query: "",
            }),
              this.showEdit.push(!1),
              (this.predicates = this.imposterService.onGetPredicates());
          }
          addResponse() {
            this.imposterService.onAddResponse({
              statusCode: "",
              headers: "",
              body: "",
            }),
              this.showEdit.push(!1),
              (this.responses = this.imposterService.onGetResponses()),
              (this.hideCloseButton = !(
                this.imposterService.onGetResponses().length > 1
              ));
          }
          addPredicatesResponses() {}
          deleteUpdate(e) {
            let r = [];
            for (let s = 0; s < this.predicates.length; s++)
              s !== e && r.push(this.predicates[s]);
            this.predicates = r;
            let i = [];
            for (let s = 0; s < this.showEdit.length; s++)
              s !== e && i.push(this.showEdit[s]);
            (this.showEdit = i), this.imposterService.onDeletePredicate(e);
          }
          deleteResponseUpdate(e) {
            let r = [];
            for (let s = 0; s < this.responses.length; s++)
              s !== e && r.push(this.responses[s]);
            this.responses = r;
            let i = [];
            for (let s = 0; s < this.showEdit.length; s++)
              s !== e && i.push(this.showEdit[s]);
            (this.showEdit = i), this.imposterService.onDeleteResponse(e);
          }
          onDelete() {
            this.deleteUpdate(this.index);
          }
          onDeleteResponse() {
            this.deleteResponseUpdate(this.indexResponse);
          }
          onDeletePredicatesResponses() {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(ei), _(sp), _(uS), _(fa));
          }),
          (n.ɵcmp = Ot({
            type: n,
            selectors: [["app-add-dependency"]],
            inputs: { index: "index", indexResponse: "indexResponse" },
            outputs: { hideCloseButton: "hideCloseButton" },
            decls: 59,
            vars: 4,
            consts: [
              [
                2,
                "max-height",
                "85vh",
                "overflow-y",
                "auto",
                "overflow-x",
                "hidden",
              ],
              [
                2,
                "font-weight",
                "bold",
                "display",
                "flex",
                "align-items",
                "center",
                "justify-content",
                "space-between",
              ],
              ["mat-icon-button", "", 1, "close-button", 3, "click"],
              ["aria-label", "Close modal"],
              [1, "container", 2, "max-width", "400px"],
              [1, "row"],
              [3, "formGroup", "ngSubmit"],
              [
                "name",
                "protocol",
                "required",
                "",
                "formControlName",
                "protocol",
                1,
                "form-control",
              ],
              ["value", "http"],
              ["value", "https"],
              [1, "form-group"],
              [
                "type",
                "number",
                "name",
                "port",
                "required",
                "",
                "formControlName",
                "port",
                1,
                "form-control",
              ],
              [
                "type",
                "text",
                "name",
                "name",
                "required",
                "",
                "formControlName",
                "name",
                1,
                "form-control",
              ],
              [
                2,
                "border",
                "1px solid #ccc",
                "border-radius",
                "10px",
                "background-color",
                "#f4f4f4",
              ],
              [
                2,
                "display",
                "flex",
                "justify-content",
                "flex-start",
                "align-items",
                "center",
                "padding-right",
                "5px",
                "padding-top",
                "0px",
              ],
              [
                2,
                "padding-bottom",
                "30px",
                "padding-left",
                "30px",
                "padding-right",
                "30px",
                "padding-top",
                "20px",
              ],
              [2, "font-weight", "bold"],
              [4, "ngFor", "ngForOf"],
              [
                2,
                "text-decoration",
                "underline",
                "cursor",
                "pointer",
                3,
                "click",
              ],
              [
                "type",
                "submit",
                1,
                "btn",
                "btn-primary",
                2,
                "margin-right",
                "10px",
                "width",
                "100%",
                3,
                "disabled",
              ],
              [3, "index", "predicate", "editUpdate", "deleteUpdate"],
              [
                3,
                "responseIndex",
                "response",
                "hideCloseButton",
                "editUpdate",
                "deleteResponseUpdate",
              ],
            ],
            template: function (e, r) {
              1 & e &&
                (E(0, "div", 0)(1, "h1", 1),
                x(2, " Add Dependency "),
                E(3, "button", 2),
                oe("click", function () {
                  return r.closeModal();
                }),
                E(4, "mat-icon", 3),
                x(5, "close"),
                S()()(),
                E(6, "div")(7, "p"),
                x(8, "Fill in the below form to add your dependency."),
                S(),
                X(9, "br"),
                E(10, "div", 4)(11, "div", 5)(12, "form", 6),
                oe("ngSubmit", function () {
                  return r.onSubmit();
                }),
                E(13, "div")(14, "label"),
                x(15, "Protocol:"),
                S(),
                E(16, "select", 7)(17, "option", 8),
                x(18, "HTTP"),
                S(),
                E(19, "option", 9),
                x(20, "HTTPS"),
                S()()(),
                X(21, "br"),
                E(22, "div", 10)(23, "label"),
                x(24, "Port:"),
                S(),
                X(25, "input", 11),
                S(),
                X(26, "br"),
                E(27, "div")(28, "label"),
                x(29, "Name:"),
                S(),
                X(30, "input", 12),
                S(),
                X(31, "br")(32, "hr"),
                E(33, "h2"),
                x(34, "Stubs"),
                S(),
                E(35, "div", 13),
                X(36, "div", 14),
                E(37, "div", 15)(38, "div")(39, "div")(40, "h3", 16),
                x(41, "Predicates"),
                S()(),
                Xe(42, r$, 2, 2, "div", 17),
                E(43, "a", 18),
                oe("click", function () {
                  return r.addPredicate();
                }),
                x(44, " Add Predicate"),
                S(),
                X(45, "br")(46, "br")(47, "br"),
                E(48, "div")(49, "h3", 16),
                x(50, "Responses"),
                S()(),
                Xe(51, i$, 2, 3, "div", 17),
                E(52, "a", 18),
                oe("click", function () {
                  return r.addResponse();
                }),
                x(53, " Add Response"),
                S()()()(),
                X(54, "br")(55, "br")(56, "br"),
                E(57, "button", 19),
                x(58, " Add Dependency "),
                S()()()()()()),
                2 & e &&
                  (L(12),
                  $("formGroup", r.dependencyForm),
                  L(30),
                  $("ngForOf", r.predicates),
                  L(9),
                  $("ngForOf", r.responses),
                  L(6),
                  $("disabled", !r.dependencyForm.valid));
            },
            dependencies: [
              Fo,
              vc,
              bc,
              Cc,
              us,
              ep,
              fs,
              cc,
              uc,
              ps,
              gg,
              au,
              hs,
              zo,
              KH,
              n$,
            ],
            styles: [
              "[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}.modal-dialog[_ngcontent-%COMP%]{max-width:800px}",
            ],
          })),
          n
        );
      })();
      const xM = "ADD_IMPOSTER";
      class o$ {
        constructor(t) {
          (this.payload = t), (this.type = xM);
        }
      }
      const c$ = new (class l$ extends Cn {})(
        class a$ extends Ec {
          constructor(t, e) {
            super(t, e), (this.scheduler = t), (this.work = e);
          }
          schedule(t, e = 0) {
            return e > 0
              ? super.schedule(t, e)
              : ((this.delay = e),
                (this.state = t),
                this.scheduler.flush(this),
                this);
          }
          execute(t, e) {
            return e > 0 || this.closed
              ? super.execute(t, e)
              : this._execute(t, e);
          }
          requestAsyncId(t, e, r = 0) {
            return (null !== r && r > 0) || (null === r && this.delay > 0)
              ? super.requestAsyncId(t, e, r)
              : t.flush(this);
          }
        },
      );
      class It {
        constructor(t, e, r) {
          (this.kind = t),
            (this.value = e),
            (this.error = r),
            (this.hasValue = "N" === t);
        }
        observe(t) {
          switch (this.kind) {
            case "N":
              return t.next && t.next(this.value);
            case "E":
              return t.error && t.error(this.error);
            case "C":
              return t.complete && t.complete();
          }
        }
        do(t, e, r) {
          switch (this.kind) {
            case "N":
              return t && t(this.value);
            case "E":
              return e && e(this.error);
            case "C":
              return r && r();
          }
        }
        accept(t, e, r) {
          return t && "function" == typeof t.next
            ? this.observe(t)
            : this.do(t, e, r);
        }
        toObservable() {
          switch (this.kind) {
            case "N":
              return k(this.value);
            case "E":
              return ii(this.error);
            case "C":
              return Rc();
          }
          throw new Error("unexpected notification kind value");
        }
        static createNext(t) {
          return typeof t < "u"
            ? new It("N", t)
            : It.undefinedValueNotification;
        }
        static createError(t) {
          return new It("E", void 0, t);
        }
        static createComplete() {
          return It.completeNotification;
        }
      }
      (It.completeNotification = new It("C")),
        (It.undefinedValueNotification = new It("N", void 0));
      class d$ {
        constructor(t, e = 0) {
          (this.scheduler = t), (this.delay = e);
        }
        call(t, e) {
          return e.subscribe(new mg(t, this.scheduler, this.delay));
        }
      }
      class mg extends ge {
        constructor(t, e, r = 0) {
          super(t), (this.scheduler = e), (this.delay = r);
        }
        static dispatch(t) {
          const { notification: e, destination: r } = t;
          e.observe(r), this.unsubscribe();
        }
        scheduleMessage(t) {
          this.destination.add(
            this.scheduler.schedule(
              mg.dispatch,
              this.delay,
              new h$(t, this.destination),
            ),
          );
        }
        _next(t) {
          this.scheduleMessage(It.createNext(t));
        }
        _error(t) {
          this.scheduleMessage(It.createError(t)), this.unsubscribe();
        }
        _complete() {
          this.scheduleMessage(It.createComplete()), this.unsubscribe();
        }
      }
      class h$ {
        constructor(t, e) {
          (this.notification = t), (this.destination = e);
        }
      }
      class p$ {
        constructor(t, e) {
          (this.observables = t), (this.project = e);
        }
        call(t, e) {
          return e.subscribe(new g$(t, this.observables, this.project));
        }
      }
      class g$ extends pS {
        constructor(t, e, r) {
          super(t),
            (this.observables = e),
            (this.project = r),
            (this.toRespond = []);
          const i = e.length;
          this.values = new Array(i);
          for (let s = 0; s < i; s++) this.toRespond.push(s);
          for (let s = 0; s < i; s++) this.add(gS(this, e[s], void 0, s));
        }
        notifyNext(t, e, r) {
          this.values[r] = e;
          const i = this.toRespond;
          if (i.length > 0) {
            const s = i.indexOf(r);
            -1 !== s && i.splice(s, 1);
          }
        }
        notifyComplete() {}
        _next(t) {
          if (0 === this.toRespond.length) {
            const e = [t, ...this.values];
            this.project ? this._tryProject(e) : this.destination.next(e);
          }
        }
        _tryProject(t) {
          let e;
          try {
            e = this.project.apply(this, t);
          } catch (r) {
            return void this.destination.error(r);
          }
          this.destination.next(e);
        }
      }
      const ga = {},
        kM = "@ngrx/store/init";
      let di = (() => {
        class n extends Ct {
          constructor() {
            super({ type: kM });
          }
          next(e) {
            if ("function" == typeof e)
              throw new TypeError(
                "\n        Dispatch expected an object, instead it received a function.\n        If you're using the createAction function, make sure to invoke the function\n        before dispatching the action. For example, someAction should be someAction().",
              );
            if (typeof e > "u") throw new TypeError("Actions must be objects");
            if (typeof e.type > "u")
              throw new TypeError("Actions must have a type property");
            super.next(e);
          }
          complete() {}
          ngOnDestroy() {
            super.complete();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const D$ = [di],
        vg = new w("@ngrx/store Internal Root Guard"),
        FM = new w("@ngrx/store Internal Initial State"),
        bg = new w("@ngrx/store Initial State"),
        PM = new w("@ngrx/store Reducer Factory"),
        NM = new w("@ngrx/store Internal Reducer Factory Provider"),
        LM = new w("@ngrx/store Initial Reducers"),
        Cg = new w("@ngrx/store Internal Initial Reducers"),
        VM = new w("@ngrx/store Store Features"),
        BM = new w("@ngrx/store Internal Store Reducers"),
        Dg = new w("@ngrx/store Internal Feature Reducers"),
        jM = new w("@ngrx/store Internal Feature Configs"),
        wg = new w("@ngrx/store Internal Store Features"),
        UM = new w("@ngrx/store Internal Feature Reducers Token"),
        Eg = new w("@ngrx/store Feature Reducers"),
        HM = new w("@ngrx/store User Provided Meta Reducers"),
        lu = new w("@ngrx/store Meta Reducers"),
        $M = new w("@ngrx/store Internal Resolved Meta Reducers"),
        zM = new w("@ngrx/store User Runtime Checks Config"),
        GM = new w("@ngrx/store Internal User Runtime Checks Config"),
        ma = new w("@ngrx/store Internal Runtime Checks"),
        _a = new w("@ngrx/store Check if Action types are unique");
      function Mg(n, t = {}) {
        const e = Object.keys(n),
          r = {};
        for (let s = 0; s < e.length; s++) {
          const o = e[s];
          "function" == typeof n[o] && (r[o] = n[o]);
        }
        const i = Object.keys(r);
        return function (o, a) {
          o = void 0 === o ? t : o;
          let l = !1;
          const c = {};
          for (let u = 0; u < i.length; u++) {
            const d = i[u],
              f = o[d],
              p = (0, r[d])(f, a);
            (c[d] = p), (l = l || p !== f);
          }
          return l ? c : o;
        };
      }
      function qM(...n) {
        return function (t) {
          if (0 === n.length) return t;
          const e = n[n.length - 1];
          return n.slice(0, -1).reduceRight((i, s) => s(i), e(t));
        };
      }
      function KM(n, t) {
        return (
          Array.isArray(t) && t.length > 0 && (n = qM.apply(null, [...t, n])),
          (e, r) => {
            const i = n(e);
            return (s, o) => i((s = void 0 === s ? r : s), o);
          }
        );
      }
      new w("@ngrx/store Root Store Provider"),
        new w("@ngrx/store Feature State Provider");
      class cu extends ye {}
      class YM extends di {}
      let ya = (() => {
        class n extends Ct {
          constructor(e, r, i, s) {
            super(s(i, r)),
              (this.dispatcher = e),
              (this.initialState = r),
              (this.reducers = i),
              (this.reducerFactory = s);
          }
          get currentReducers() {
            return this.reducers;
          }
          addFeature(e) {
            this.addFeatures([e]);
          }
          addFeatures(e) {
            const r = e.reduce(
              (
                i,
                {
                  reducers: s,
                  reducerFactory: o,
                  metaReducers: a,
                  initialState: l,
                  key: c,
                },
              ) => {
                const u =
                  "function" == typeof s
                    ? (function E$(n) {
                        const t =
                          Array.isArray(n) && n.length > 0
                            ? qM(...n)
                            : (e) => e;
                        return (e, r) => (
                          (e = t(e)), (i, s) => e((i = void 0 === i ? r : i), s)
                        );
                      })(a)(s, l)
                    : KM(o, a)(s, l);
                return (i[c] = u), i;
              },
              {},
            );
            this.addReducers(r);
          }
          removeFeature(e) {
            this.removeFeatures([e]);
          }
          removeFeatures(e) {
            this.removeReducers(e.map((r) => r.key));
          }
          addReducer(e, r) {
            this.addReducers({ [e]: r });
          }
          addReducers(e) {
            (this.reducers = { ...this.reducers, ...e }),
              this.updateReducers(Object.keys(e));
          }
          removeReducer(e) {
            this.removeReducers([e]);
          }
          removeReducers(e) {
            e.forEach((r) => {
              this.reducers = (function w$(n, t) {
                return Object.keys(n)
                  .filter((e) => e !== t)
                  .reduce((e, r) => Object.assign(e, { [r]: n[r] }), {});
              })(this.reducers, r);
            }),
              this.updateReducers(e);
          }
          updateReducers(e) {
            this.next(this.reducerFactory(this.reducers, this.initialState)),
              this.dispatcher.next({
                type: "@ngrx/store/update-reducers",
                features: e,
              });
          }
          ngOnDestroy() {
            this.complete();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(YM), m(bg), m(LM), m(PM));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const M$ = [
        ya,
        { provide: cu, useExisting: ya },
        { provide: YM, useExisting: di },
      ];
      let uu = (() => {
        class n extends de {
          ngOnDestroy() {
            this.complete();
          }
        }
        return (
          (n.ɵfac = (function () {
            let t;
            return function (r) {
              return (t || (t = We(n)))(r || n);
            };
          })()),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const A$ = [uu];
      class ZM extends ye {}
      let QM = (() => {
        class n extends Ct {
          constructor(e, r, i, s) {
            super(s);
            const a = e
                .pipe(
                  (function u$(n, t = 0) {
                    return function (r) {
                      return r.lift(new d$(n, t));
                    };
                  })(c$),
                )
                .pipe(
                  (function f$(...n) {
                    return (t) => {
                      let e;
                      return (
                        "function" == typeof n[n.length - 1] && (e = n.pop()),
                        t.lift(new p$(n, e))
                      );
                    };
                  })(r),
                ),
              c = a.pipe(Vp(T$, { state: s }));
            this.stateSubscription = c.subscribe(({ state: u, action: d }) => {
              this.next(u), i.next(d);
            });
          }
          ngOnDestroy() {
            this.stateSubscription.unsubscribe(), this.complete();
          }
        }
        return (
          (n.INIT = kM),
          (n.ɵfac = function (e) {
            return new (e || n)(m(di), m(cu), m(uu), m(bg));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      function T$(n = { state: void 0 }, [t, e]) {
        const { state: r } = n;
        return { state: e(r, t), action: t };
      }
      const I$ = [QM, { provide: ZM, useExisting: QM }];
      let va = (() => {
        class n extends ye {
          constructor(e, r, i) {
            super(),
              (this.actionsObserver = r),
              (this.reducerManager = i),
              (this.source = e);
          }
          select(e, ...r) {
            return x$.call(null, e, ...r)(this);
          }
          lift(e) {
            const r = new n(this, this.actionsObserver, this.reducerManager);
            return (r.operator = e), r;
          }
          dispatch(e) {
            this.actionsObserver.next(e);
          }
          next(e) {
            this.actionsObserver.next(e);
          }
          error(e) {
            this.actionsObserver.error(e);
          }
          complete() {
            this.actionsObserver.complete();
          }
          addReducer(e, r) {
            this.reducerManager.addReducer(e, r);
          }
          removeReducer(e) {
            this.reducerManager.removeReducer(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(ZM), m(di), m(ya));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const R$ = [va];
      function x$(n, t, ...e) {
        return function (i) {
          let s;
          if ("string" == typeof n) {
            const o = [t, ...e].filter(Boolean);
            s = i.pipe(
              (function m$(...n) {
                const t = n.length;
                if (0 === t)
                  throw new Error("list of properties cannot be empty.");
                return (e) =>
                  U(
                    (function _$(n, t) {
                      return (r) => {
                        let i = r;
                        for (let s = 0; s < t; s++) {
                          const o = i?.[n[s]];
                          if (void 0 === o) return;
                          i = o;
                        }
                        return i;
                      };
                    })(n, t),
                  )(e);
              })(n, ...o),
            );
          } else {
            if ("function" != typeof n)
              throw new TypeError(
                `Unexpected type '${typeof n}' in select operator, expected 'string' or 'function'`,
              );
            s = i.pipe(U((o) => n(o, t)));
          }
          return s.pipe(HE());
        };
      }
      const Ag = "https://ngrx.io/guide/store/configuration/runtime-checks";
      function XM(n) {
        return void 0 === n;
      }
      function JM(n) {
        return null === n;
      }
      function e0(n) {
        return Array.isArray(n);
      }
      function t0(n) {
        return "object" == typeof n && null !== n;
      }
      function Tg(n) {
        return "function" == typeof n;
      }
      function G$(n, t) {
        return t instanceof w ? n.get(t) : t;
      }
      function W$(n, t, e) {
        return e.map((r, i) => {
          if (t[i] instanceof w) {
            const s = n.get(t[i]);
            return {
              key: r.key,
              reducerFactory: s.reducerFactory ? s.reducerFactory : Mg,
              metaReducers: s.metaReducers ? s.metaReducers : [],
              initialState: s.initialState,
            };
          }
          return r;
        });
      }
      function q$(n, t) {
        return t.map((r) => (r instanceof w ? n.get(r) : r));
      }
      function xg(n) {
        return "function" == typeof n ? n() : n;
      }
      function K$(n, t) {
        return n.concat(t);
      }
      function Y$(n) {
        if (n)
          throw new TypeError(
            "The root Store has been provided more than once. Feature modules should provide feature states instead.",
          );
        return "guarded";
      }
      function Og(n) {
        Object.freeze(n);
        const t = Tg(n);
        return (
          Object.getOwnPropertyNames(n).forEach((e) => {
            if (
              !e.startsWith("\u0275") &&
              (function L$(n, t) {
                return Object.prototype.hasOwnProperty.call(n, t);
              })(n, e) &&
              (!t || ("caller" !== e && "callee" !== e && "arguments" !== e))
            ) {
              const r = n[e];
              (t0(r) || Tg(r)) && !Object.isFrozen(r) && Og(r);
            }
          }),
          n
        );
      }
      function kg(n, t = []) {
        return (XM(n) || JM(n)) && 0 === t.length
          ? { path: ["root"], value: n }
          : Object.keys(n).reduce((r, i) => {
              if (r) return r;
              const s = n[i];
              return (function N$(n) {
                return Tg(n) && n.hasOwnProperty("\u0275cmp");
              })(s)
                ? r
                : !(
                    XM(s) ||
                    JM(s) ||
                    (function F$(n) {
                      return "number" == typeof n;
                    })(s) ||
                    (function k$(n) {
                      return "boolean" == typeof n;
                    })(s) ||
                    (function O$(n) {
                      return "string" == typeof n;
                    })(s) ||
                    e0(s)
                  ) &&
                    ((function n0(n) {
                      if (
                        !(function P$(n) {
                          return t0(n) && !e0(n);
                        })(n)
                      )
                        return !1;
                      const t = Object.getPrototypeOf(n);
                      return t === Object.prototype || null === t;
                    })(s)
                      ? kg(s, [...t, i])
                      : { path: [...t, i], value: s });
            }, !1);
      }
      function o0(n, t) {
        if (!1 === n) return;
        const e = n.path.join("."),
          r = new Error(
            `Detected unserializable ${t} at "${e}". ${Ag}#strict${t}serializability`,
          );
        throw ((r.value = n.value), (r.unserializablePath = e), r);
      }
      function J$(n) {
        return (function kP() {
          return (zC = !0), $C;
        })()
          ? {
              strictStateSerializability: !1,
              strictActionSerializability: !1,
              strictStateImmutability: !0,
              strictActionImmutability: !0,
              strictActionWithinNgZone: !1,
              strictActionTypeUniqueness: !1,
              ...n,
            }
          : {
              strictStateSerializability: !1,
              strictActionSerializability: !1,
              strictStateImmutability: !1,
              strictActionImmutability: !1,
              strictActionWithinNgZone: !1,
              strictActionTypeUniqueness: !1,
            };
      }
      function ez({
        strictActionSerializability: n,
        strictStateSerializability: t,
      }) {
        return (e) =>
          n || t
            ? (function Q$(n, t) {
                return function (e, r) {
                  t.action(r) && o0(kg(r), "action");
                  const i = n(e, r);
                  return t.state() && o0(kg(i), "state"), i;
                };
              })(e, { action: (r) => n && !Fg(r), state: () => t })
            : e;
      }
      function tz({ strictActionImmutability: n, strictStateImmutability: t }) {
        return (e) =>
          n || t
            ? (function Z$(n, t) {
                return function (e, r) {
                  const i = t.action(r) ? Og(r) : r,
                    s = n(e, i);
                  return t.state() ? Og(s) : s;
                };
              })(e, { action: (r) => n && !Fg(r), state: () => t })
            : e;
      }
      function Fg(n) {
        return n.type.startsWith("@ngrx");
      }
      function nz({ strictActionWithinNgZone: n }) {
        return (t) =>
          n
            ? (function X$(n, t) {
                return function (e, r) {
                  if (t.action(r) && !le.isInAngularZone())
                    throw new Error(
                      `Action '${r.type}' running outside NgZone. ${Ag}#strictactionwithinngzone`,
                    );
                  return n(e, r);
                };
              })(t, { action: (e) => n && !Fg(e) })
            : t;
      }
      function rz(n) {
        return [
          { provide: GM, useValue: n },
          { provide: zM, useFactory: iz, deps: [GM] },
          { provide: ma, deps: [zM], useFactory: J$ },
          { provide: lu, multi: !0, deps: [ma], useFactory: tz },
          { provide: lu, multi: !0, deps: [ma], useFactory: ez },
          { provide: lu, multi: !0, deps: [ma], useFactory: nz },
        ];
      }
      function a0() {
        return [{ provide: _a, multi: !0, deps: [ma], useFactory: sz }];
      }
      function iz(n) {
        return n;
      }
      function sz(n) {
        if (!n.strictActionTypeUniqueness) return;
        const t = Object.entries(ga)
          .filter(([, e]) => e > 1)
          .map(([e]) => e);
        if (t.length)
          throw new Error(
            `Action types are registered more than once, ${t.map((e) => `"${e}"`).join(", ")}. ${Ag}#strictactiontypeuniqueness`,
          );
      }
      function l0(n, t) {
        return [
          { provide: vg, useFactory: Y$, deps: [[va, new Wn(), new jr()]] },
          { provide: FM, useValue: t.initialState },
          { provide: bg, useFactory: xg, deps: [FM] },
          { provide: Cg, useValue: n },
          { provide: BM, useExisting: n instanceof w ? n : Cg },
          { provide: LM, deps: [Ne, Cg, [new Js(BM)]], useFactory: G$ },
          { provide: HM, useValue: t.metaReducers ? t.metaReducers : [] },
          { provide: $M, deps: [lu, HM], useFactory: K$ },
          { provide: NM, useValue: t.reducerFactory ? t.reducerFactory : Mg },
          { provide: PM, deps: [NM, $M], useFactory: KM },
          D$,
          M$,
          A$,
          I$,
          R$,
          rz(t.runtimeChecks),
          a0(),
        ];
      }
      function c0(n, t, e = {}) {
        return [
          { provide: jM, multi: !0, useValue: n instanceof Object ? {} : e },
          {
            provide: VM,
            multi: !0,
            useValue: {
              key: n instanceof Object ? n.name : n,
              reducerFactory:
                e instanceof w || !e.reducerFactory ? Mg : e.reducerFactory,
              metaReducers:
                e instanceof w || !e.metaReducers ? [] : e.metaReducers,
              initialState:
                e instanceof w || !e.initialState ? void 0 : e.initialState,
            },
          },
          { provide: wg, deps: [Ne, jM, VM], useFactory: W$ },
          {
            provide: Dg,
            multi: !0,
            useValue: n instanceof Object ? n.reducer : t,
          },
          { provide: UM, multi: !0, useExisting: t instanceof w ? t : Dg },
          {
            provide: Eg,
            multi: !0,
            deps: [Ne, Dg, [new Js(UM)]],
            useFactory: q$,
          },
          a0(),
        ];
      }
      let u0 = (() => {
          class n {
            constructor(e, r, i, s, o, a) {}
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                m(di),
                m(cu),
                m(uu),
                m(va),
                m(vg, 8),
                m(_a, 8),
              );
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })(),
        uz = (() => {
          class n {
            constructor(e, r, i, s, o) {
              (this.features = e),
                (this.featureReducers = r),
                (this.reducerManager = i);
              const a = e.map((l, c) => {
                const d = r.shift()[c];
                return { ...l, reducers: d, initialState: xg(l.initialState) };
              });
              i.addFeatures(a);
            }
            ngOnDestroy() {
              this.reducerManager.removeFeatures(this.features);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(m(wg), m(Eg), m(ya), m(u0), m(_a, 8));
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })(),
        dz = (() => {
          class n {
            static forRoot(e, r = {}) {
              return { ngModule: u0, providers: [...l0(e, r)] };
            }
            static forFeature(e, r, i = {}) {
              return { ngModule: uz, providers: [...c0(e, r, i)] };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({})),
            n
          );
        })();
      class hz {
        constructor(t, e) {
          this._document = e;
          const r = (this._textarea = this._document.createElement("textarea")),
            i = r.style;
          (i.position = "fixed"),
            (i.top = i.opacity = "0"),
            (i.left = "-999em"),
            r.setAttribute("aria-hidden", "true"),
            (r.value = t),
            this._document.body.appendChild(r);
        }
        copy() {
          const t = this._textarea;
          let e = !1;
          try {
            if (t) {
              const r = this._document.activeElement;
              t.select(),
                t.setSelectionRange(0, t.value.length),
                (e = this._document.execCommand("copy")),
                r && r.focus();
            }
          } catch {}
          return e;
        }
        destroy() {
          const t = this._textarea;
          t && (t.remove(), (this._textarea = void 0));
        }
      }
      let fz = (() => {
        class n {
          constructor(e) {
            this._document = e;
          }
          copy(e) {
            const r = this.beginCopy(e),
              i = r.copy();
            return r.destroy(), i;
          }
          beginCopy(e) {
            return new hz(e, this._document);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Y));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function d0(n, t = Mc) {
        const r = (function pz(n) {
          return n instanceof Date && !isNaN(+n);
        })(n)
          ? +n - t.now()
          : Math.abs(n);
        return (i) => i.lift(new gz(r, t));
      }
      class gz {
        constructor(t, e) {
          (this.delay = t), (this.scheduler = e);
        }
        call(t, e) {
          return e.subscribe(new Pg(t, this.delay, this.scheduler));
        }
      }
      class Pg extends ge {
        constructor(t, e, r) {
          super(t),
            (this.delay = e),
            (this.scheduler = r),
            (this.queue = []),
            (this.active = !1),
            (this.errored = !1);
        }
        static dispatch(t) {
          const e = t.source,
            r = e.queue,
            i = t.scheduler,
            s = t.destination;
          for (; r.length > 0 && r[0].time - i.now() <= 0; )
            r.shift().notification.observe(s);
          if (r.length > 0) {
            const o = Math.max(0, r[0].time - i.now());
            this.schedule(t, o);
          } else this.unsubscribe(), (e.active = !1);
        }
        _schedule(t) {
          (this.active = !0),
            this.destination.add(
              t.schedule(Pg.dispatch, this.delay, {
                source: this,
                destination: this.destination,
                scheduler: t,
              }),
            );
        }
        scheduleNotification(t) {
          if (!0 === this.errored) return;
          const e = this.scheduler,
            r = new mz(e.now() + this.delay, t);
          this.queue.push(r), !1 === this.active && this._schedule(e);
        }
        _next(t) {
          this.scheduleNotification(It.createNext(t));
        }
        _error(t) {
          (this.errored = !0),
            (this.queue = []),
            this.destination.error(t),
            this.unsubscribe();
        }
        _complete() {
          this.scheduleNotification(It.createComplete()), this.unsubscribe();
        }
      }
      class mz {
        constructor(t, e) {
          (this.time = t), (this.notification = e);
        }
      }
      const _z = ["mat-menu-item", ""];
      function yz(n, t) {
        1 & n &&
          ((function Gm() {
            z.lFrame.currentNamespace = "svg";
          })(),
          E(0, "svg", 2),
          X(1, "polygon", 3),
          S());
      }
      const h0 = ["*"];
      function vz(n, t) {
        if (1 & n) {
          const e = es();
          E(0, "div", 0),
            oe("keydown", function (i) {
              return Et(e), St(tt()._handleKeydown(i));
            })("click", function () {
              return Et(e), St(tt().closed.emit("click"));
            })("@transformMenu.start", function (i) {
              return Et(e), St(tt()._onAnimationStart(i));
            })("@transformMenu.done", function (i) {
              return Et(e), St(tt()._onAnimationDone(i));
            }),
            E(1, "div", 1),
            _o(2),
            S()();
        }
        if (2 & n) {
          const e = tt();
          $("id", e.panelId)("ngClass", e._classList)(
            "@transformMenu",
            e._panelAnimationState,
          ),
            et("aria-label", e.ariaLabel || null)(
              "aria-labelledby",
              e.ariaLabelledby || null,
            )("aria-describedby", e.ariaDescribedby || null);
        }
      }
      const du = {
          transformMenu: Pp("transformMenu", [
            Fc("void", Dn({ opacity: 0, transform: "scale(0.8)" })),
            Xo(
              "void => enter",
              Qo(
                "120ms cubic-bezier(0, 0, 0.2, 1)",
                Dn({ opacity: 1, transform: "scale(1)" }),
              ),
            ),
            Xo("* => void", Qo("100ms 25ms linear", Dn({ opacity: 0 }))),
          ]),
          fadeInItems: Pp("fadeInItems", [
            Fc("showing", Dn({ opacity: 1 })),
            Xo("void => *", [
              Dn({ opacity: 0 }),
              Qo("400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)"),
            ]),
          ]),
        },
        bz = new w("MatMenuContent"),
        Ng = new w("MAT_MENU_PANEL"),
        Cz = tS(JE(class {}));
      let hu = (() => {
        class n extends Cz {
          constructor(e, r, i, s, o) {
            super(),
              (this._elementRef = e),
              (this._focusMonitor = i),
              (this._parentMenu = s),
              (this._changeDetectorRef = o),
              (this.role = "menuitem"),
              (this._hovered = new de()),
              (this._focused = new de()),
              (this._highlighted = !1),
              (this._triggersSubmenu = !1),
              s && s.addItem && s.addItem(this);
          }
          focus(e, r) {
            this._focusMonitor && e
              ? this._focusMonitor.focusVia(this._getHostElement(), e, r)
              : this._getHostElement().focus(r),
              this._focused.next(this);
          }
          ngAfterViewInit() {
            this._focusMonitor &&
              this._focusMonitor.monitor(this._elementRef, !1);
          }
          ngOnDestroy() {
            this._focusMonitor &&
              this._focusMonitor.stopMonitoring(this._elementRef),
              this._parentMenu &&
                this._parentMenu.removeItem &&
                this._parentMenu.removeItem(this),
              this._hovered.complete(),
              this._focused.complete();
          }
          _getTabIndex() {
            return this.disabled ? "-1" : "0";
          }
          _getHostElement() {
            return this._elementRef.nativeElement;
          }
          _checkDisabled(e) {
            this.disabled && (e.preventDefault(), e.stopPropagation());
          }
          _handleMouseEnter() {
            this._hovered.next(this);
          }
          getLabel() {
            const e = this._elementRef.nativeElement.cloneNode(!0),
              r = e.querySelectorAll("mat-icon, .material-icons");
            for (let i = 0; i < r.length; i++) r[i].remove();
            return e.textContent?.trim() || "";
          }
          _setHighlighted(e) {
            (this._highlighted = e), this._changeDetectorRef?.markForCheck();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(_(Ie), _(Y), _(kc), _(Ng, 8), _(cs));
          }),
          (n.ɵcmp = Ot({
            type: n,
            selectors: [["", "mat-menu-item", ""]],
            hostAttrs: [1, "mat-focus-indicator"],
            hostVars: 10,
            hostBindings: function (e, r) {
              1 & e &&
                oe("click", function (s) {
                  return r._checkDisabled(s);
                })("mouseenter", function () {
                  return r._handleMouseEnter();
                }),
                2 & e &&
                  (et("role", r.role)("tabindex", r._getTabIndex())(
                    "aria-disabled",
                    r.disabled.toString(),
                  )("disabled", r.disabled || null),
                  Jn("mat-menu-item", !0)(
                    "mat-menu-item-highlighted",
                    r._highlighted,
                  )("mat-menu-item-submenu-trigger", r._triggersSubmenu));
            },
            inputs: {
              disabled: "disabled",
              disableRipple: "disableRipple",
              role: "role",
            },
            exportAs: ["matMenuItem"],
            features: [ne],
            attrs: _z,
            ngContentSelectors: h0,
            decls: 3,
            vars: 3,
            consts: [
              [
                "matRipple",
                "",
                1,
                "mat-menu-ripple",
                3,
                "matRippleDisabled",
                "matRippleTrigger",
              ],
              [
                "class",
                "mat-menu-submenu-icon",
                "viewBox",
                "0 0 5 10",
                "focusable",
                "false",
                4,
                "ngIf",
              ],
              [
                "viewBox",
                "0 0 5 10",
                "focusable",
                "false",
                1,
                "mat-menu-submenu-icon",
              ],
              ["points", "0,0 5,5 0,10"],
            ],
            template: function (e, r) {
              1 & e && (mo(), _o(0), X(1, "div", 0), Xe(2, yz, 2, 0, "svg", 1)),
                2 & e &&
                  (L(1),
                  $("matRippleDisabled", r.disableRipple || r.disabled)(
                    "matRippleTrigger",
                    r._getHostElement(),
                  ),
                  L(1),
                  $("ngIf", r._triggersSubmenu));
            },
            dependencies: [Op, Af],
            encapsulation: 2,
            changeDetection: 0,
          })),
          n
        );
      })();
      const f0 = new w("mat-menu-default-options", {
        providedIn: "root",
        factory: function Dz() {
          return {
            overlapTrigger: !1,
            xPosition: "after",
            yPosition: "below",
            backdropClass: "cdk-overlay-transparent-backdrop",
          };
        },
      });
      let wz = 0,
        ba = (() => {
          class n {
            constructor(e, r, i) {
              (this._elementRef = e),
                (this._ngZone = r),
                (this._defaultOptions = i),
                (this._xPosition = this._defaultOptions.xPosition),
                (this._yPosition = this._defaultOptions.yPosition),
                (this._directDescendantItems = new is()),
                (this._tabSubscription = ue.EMPTY),
                (this._classList = {}),
                (this._panelAnimationState = "void"),
                (this._animationDone = new de()),
                (this.overlayPanelClass =
                  this._defaultOptions.overlayPanelClass || ""),
                (this.backdropClass = this._defaultOptions.backdropClass),
                (this._overlapTrigger = this._defaultOptions.overlapTrigger),
                (this._hasBackdrop = this._defaultOptions.hasBackdrop),
                (this.closed = new ae()),
                (this.close = this.closed),
                (this.panelId = "mat-menu-panel-" + wz++);
            }
            get xPosition() {
              return this._xPosition;
            }
            set xPosition(e) {
              (this._xPosition = e), this.setPositionClasses();
            }
            get yPosition() {
              return this._yPosition;
            }
            set yPosition(e) {
              (this._yPosition = e), this.setPositionClasses();
            }
            get overlapTrigger() {
              return this._overlapTrigger;
            }
            set overlapTrigger(e) {
              this._overlapTrigger = Wo(e);
            }
            get hasBackdrop() {
              return this._hasBackdrop;
            }
            set hasBackdrop(e) {
              this._hasBackdrop = Wo(e);
            }
            set panelClass(e) {
              const r = this._previousPanelClass;
              r &&
                r.length &&
                r.split(" ").forEach((i) => {
                  this._classList[i] = !1;
                }),
                (this._previousPanelClass = e),
                e &&
                  e.length &&
                  (e.split(" ").forEach((i) => {
                    this._classList[i] = !0;
                  }),
                  (this._elementRef.nativeElement.className = ""));
            }
            get classList() {
              return this.panelClass;
            }
            set classList(e) {
              this.panelClass = e;
            }
            ngOnInit() {
              this.setPositionClasses();
            }
            ngAfterContentInit() {
              this._updateDirectDescendants(),
                (this._keyManager = new ZB(this._directDescendantItems)
                  .withWrap()
                  .withTypeAhead()
                  .withHomeAndEnd()),
                (this._tabSubscription = this._keyManager.tabOut.subscribe(() =>
                  this.closed.emit("tab"),
                )),
                this._directDescendantItems.changes
                  .pipe(
                    Zo(this._directDescendantItems),
                    Ht((e) => Ns(...e.map((r) => r._focused))),
                  )
                  .subscribe((e) => this._keyManager.updateActiveItem(e));
            }
            ngOnDestroy() {
              this._directDescendantItems.destroy(),
                this._tabSubscription.unsubscribe(),
                this.closed.complete();
            }
            _hovered() {
              return this._directDescendantItems.changes.pipe(
                Zo(this._directDescendantItems),
                Ht((r) => Ns(...r.map((i) => i._hovered))),
              );
            }
            addItem(e) {}
            removeItem(e) {}
            _handleKeydown(e) {
              const r = e.keyCode,
                i = this._keyManager;
              switch (r) {
                case 27:
                  Ap(e) || (e.preventDefault(), this.closed.emit("keydown"));
                  break;
                case 37:
                  this.parentMenu &&
                    "ltr" === this.direction &&
                    this.closed.emit("keydown");
                  break;
                case 39:
                  this.parentMenu &&
                    "rtl" === this.direction &&
                    this.closed.emit("keydown");
                  break;
                default:
                  (38 === r || 40 === r) && i.setFocusOrigin("keyboard"),
                    i.onKeydown(e);
              }
            }
            focusFirstItem(e = "program") {
              this.lazyContent
                ? this._ngZone.onStable
                    .pipe(Tt(1))
                    .subscribe(() => this._focusFirstItem(e))
                : this._focusFirstItem(e);
            }
            _focusFirstItem(e) {
              const r = this._keyManager;
              if (
                (r.setFocusOrigin(e).setFirstItemActive(),
                !r.activeItem && this._directDescendantItems.length)
              ) {
                let i =
                  this._directDescendantItems.first._getHostElement()
                    .parentElement;
                for (; i; ) {
                  if ("menu" === i.getAttribute("role")) {
                    i.focus();
                    break;
                  }
                  i = i.parentElement;
                }
              }
            }
            resetActiveItem() {
              this._keyManager.setActiveItem(-1);
            }
            setElevation(e) {
              const r = Math.min(this._baseElevation + e, 24),
                i = `${this._elevationPrefix}${r}`,
                s = Object.keys(this._classList).find((o) =>
                  o.startsWith(this._elevationPrefix),
                );
              (!s || s === this._previousElevation) &&
                (this._previousElevation &&
                  (this._classList[this._previousElevation] = !1),
                (this._classList[i] = !0),
                (this._previousElevation = i));
            }
            setPositionClasses(e = this.xPosition, r = this.yPosition) {
              const i = this._classList;
              (i["mat-menu-before"] = "before" === e),
                (i["mat-menu-after"] = "after" === e),
                (i["mat-menu-above"] = "above" === r),
                (i["mat-menu-below"] = "below" === r);
            }
            _startAnimation() {
              this._panelAnimationState = "enter";
            }
            _resetAnimation() {
              this._panelAnimationState = "void";
            }
            _onAnimationDone(e) {
              this._animationDone.next(e), (this._isAnimating = !1);
            }
            _onAnimationStart(e) {
              (this._isAnimating = !0),
                "enter" === e.toState &&
                  0 === this._keyManager.activeItemIndex &&
                  (e.element.scrollTop = 0);
            }
            _updateDirectDescendants() {
              this._allItems.changes.pipe(Zo(this._allItems)).subscribe((e) => {
                this._directDescendantItems.reset(
                  e.filter((r) => r._parentMenu === this),
                ),
                  this._directDescendantItems.notifyOnChanges();
              });
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Ie), _(le), _(f0));
            }),
            (n.ɵdir = F({
              type: n,
              contentQueries: function (e, r, i) {
                if (
                  (1 & e && (ss(i, bz, 5), ss(i, hu, 5), ss(i, hu, 4)), 2 & e)
                ) {
                  let s;
                  xn((s = On())) && (r.lazyContent = s.first),
                    xn((s = On())) && (r._allItems = s),
                    xn((s = On())) && (r.items = s);
                }
              },
              viewQuery: function (e, r) {
                if ((1 & e && Mo(_n, 5), 2 & e)) {
                  let i;
                  xn((i = On())) && (r.templateRef = i.first);
                }
              },
              inputs: {
                backdropClass: "backdropClass",
                ariaLabel: ["aria-label", "ariaLabel"],
                ariaLabelledby: ["aria-labelledby", "ariaLabelledby"],
                ariaDescribedby: ["aria-describedby", "ariaDescribedby"],
                xPosition: "xPosition",
                yPosition: "yPosition",
                overlapTrigger: "overlapTrigger",
                hasBackdrop: "hasBackdrop",
                panelClass: ["class", "panelClass"],
                classList: "classList",
              },
              outputs: { closed: "closed", close: "close" },
            })),
            n
          );
        })(),
        Ez = (() => {
          class n extends ba {
            constructor(e, r, i) {
              super(e, r, i),
                (this._elevationPrefix = "mat-elevation-z"),
                (this._baseElevation = 4);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(_(Ie), _(le), _(f0));
            }),
            (n.ɵcmp = Ot({
              type: n,
              selectors: [["mat-menu"]],
              hostVars: 3,
              hostBindings: function (e, r) {
                2 & e &&
                  et("aria-label", null)("aria-labelledby", null)(
                    "aria-describedby",
                    null,
                  );
              },
              exportAs: ["matMenu"],
              features: [Ae([{ provide: Ng, useExisting: n }]), ne],
              ngContentSelectors: h0,
              decls: 1,
              vars: 0,
              consts: [
                [
                  "tabindex",
                  "-1",
                  "role",
                  "menu",
                  1,
                  "mat-menu-panel",
                  3,
                  "id",
                  "ngClass",
                  "keydown",
                  "click",
                ],
                [1, "mat-menu-content"],
              ],
              template: function (e, r) {
                1 & e && (mo(), Xe(0, vz, 3, 6, "ng-template"));
              },
              dependencies: [gD],
              styles: [
                "mat-menu{display:none}.mat-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100vh - 48px);border-radius:4px;outline:0;min-height:64px}.mat-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-menu-panel{outline:solid 1px}.mat-menu-content:not(:empty){padding-top:8px;padding-bottom:8px}.mat-menu-item{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;position:relative}.mat-menu-item::-moz-focus-inner{border:0}.mat-menu-item[disabled]{cursor:default}[dir=rtl] .mat-menu-item{text-align:right}.mat-menu-item .mat-icon{margin-right:16px;vertical-align:middle}.mat-menu-item .mat-icon svg{vertical-align:top}[dir=rtl] .mat-menu-item .mat-icon{margin-left:16px;margin-right:0}.mat-menu-item[disabled]{pointer-events:none}.cdk-high-contrast-active .mat-menu-item{margin-top:1px}.cdk-high-contrast-active .mat-menu-item.cdk-program-focused,.cdk-high-contrast-active .mat-menu-item.cdk-keyboard-focused,.cdk-high-contrast-active .mat-menu-item-highlighted{outline:dotted 1px}.mat-menu-item-submenu-trigger{padding-right:32px}[dir=rtl] .mat-menu-item-submenu-trigger{padding-right:16px;padding-left:32px}.mat-menu-submenu-icon{position:absolute;top:50%;right:16px;transform:translateY(-50%);width:5px;height:10px;fill:currentColor}[dir=rtl] .mat-menu-submenu-icon{right:auto;left:16px;transform:translateY(-50%) scaleX(-1)}.cdk-high-contrast-active .mat-menu-submenu-icon{fill:CanvasText}button.mat-menu-item{width:100%}.mat-menu-item .mat-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n",
              ],
              encapsulation: 2,
              data: { animation: [du.transformMenu, du.fadeInItems] },
              changeDetection: 0,
            })),
            n
          );
        })();
      const p0 = new w("mat-menu-scroll-strategy"),
        Mz = {
          provide: p0,
          deps: [ys],
          useFactory: function Sz(n) {
            return () => n.scrollStrategies.reposition();
          },
        },
        m0 = Ac({ passive: !0 });
      let Az = (() => {
          class n {
            constructor(e, r, i, s, o, a, l, c) {
              (this._overlay = e),
                (this._element = r),
                (this._viewContainerRef = i),
                (this._menuItemInstance = a),
                (this._dir = l),
                (this._focusMonitor = c),
                (this._overlayRef = null),
                (this._menuOpen = !1),
                (this._closingActionsSubscription = ue.EMPTY),
                (this._hoverSubscription = ue.EMPTY),
                (this._menuCloseSubscription = ue.EMPTY),
                (this._handleTouchStart = (u) => {
                  Ip(u) || (this._openedBy = "touch");
                }),
                (this._openedBy = void 0),
                (this.restoreFocus = !0),
                (this.menuOpened = new ae()),
                (this.onMenuOpen = this.menuOpened),
                (this.menuClosed = new ae()),
                (this.onMenuClose = this.menuClosed),
                (this._scrollStrategy = s),
                (this._parentMaterialMenu = o instanceof ba ? o : void 0),
                r.nativeElement.addEventListener(
                  "touchstart",
                  this._handleTouchStart,
                  m0,
                ),
                a && (a._triggersSubmenu = this.triggersSubmenu());
            }
            get _deprecatedMatMenuTriggerFor() {
              return this.menu;
            }
            set _deprecatedMatMenuTriggerFor(e) {
              this.menu = e;
            }
            get menu() {
              return this._menu;
            }
            set menu(e) {
              e !== this._menu &&
                ((this._menu = e),
                this._menuCloseSubscription.unsubscribe(),
                e &&
                  (this._menuCloseSubscription = e.close.subscribe((r) => {
                    this._destroyMenu(r),
                      ("click" === r || "tab" === r) &&
                        this._parentMaterialMenu &&
                        this._parentMaterialMenu.closed.emit(r);
                  })));
            }
            ngAfterContentInit() {
              this._checkMenu(), this._handleHover();
            }
            ngOnDestroy() {
              this._overlayRef &&
                (this._overlayRef.dispose(), (this._overlayRef = null)),
                this._element.nativeElement.removeEventListener(
                  "touchstart",
                  this._handleTouchStart,
                  m0,
                ),
                this._menuCloseSubscription.unsubscribe(),
                this._closingActionsSubscription.unsubscribe(),
                this._hoverSubscription.unsubscribe();
            }
            get menuOpen() {
              return this._menuOpen;
            }
            get dir() {
              return this._dir && "rtl" === this._dir.value ? "rtl" : "ltr";
            }
            triggersSubmenu() {
              return !(!this._menuItemInstance || !this._parentMaterialMenu);
            }
            toggleMenu() {
              return this._menuOpen ? this.closeMenu() : this.openMenu();
            }
            openMenu() {
              if (this._menuOpen) return;
              this._checkMenu();
              const e = this._createOverlay(),
                r = e.getConfig();
              this._setPosition(r.positionStrategy),
                (r.hasBackdrop =
                  this.menu.hasBackdrop ?? !this.triggersSubmenu()),
                e.attach(this._getPortal()),
                this.menu.lazyContent &&
                  this.menu.lazyContent.attach(this.menuData),
                (this._closingActionsSubscription =
                  this._menuClosingActions().subscribe(() => this.closeMenu())),
                this._initMenu(),
                this.menu instanceof ba && this.menu._startAnimation();
            }
            closeMenu() {
              this.menu.close.emit();
            }
            focus(e, r) {
              this._focusMonitor && e
                ? this._focusMonitor.focusVia(this._element, e, r)
                : this._element.nativeElement.focus(r);
            }
            updatePosition() {
              this._overlayRef?.updatePosition();
            }
            _destroyMenu(e) {
              if (!this._overlayRef || !this.menuOpen) return;
              const r = this.menu;
              this._closingActionsSubscription.unsubscribe(),
                this._overlayRef.detach(),
                this.restoreFocus &&
                  ("keydown" === e ||
                    !this._openedBy ||
                    !this.triggersSubmenu()) &&
                  this.focus(this._openedBy),
                (this._openedBy = void 0),
                r instanceof ba
                  ? (r._resetAnimation(),
                    r.lazyContent
                      ? r._animationDone
                          .pipe(
                            Ze((i) => "void" === i.toState),
                            Tt(1),
                            xc(r.lazyContent._attached),
                          )
                          .subscribe({
                            next: () => r.lazyContent.detach(),
                            complete: () => this._setIsMenuOpen(!1),
                          })
                      : this._setIsMenuOpen(!1))
                  : (this._setIsMenuOpen(!1),
                    r.lazyContent && r.lazyContent.detach());
            }
            _initMenu() {
              (this.menu.parentMenu = this.triggersSubmenu()
                ? this._parentMaterialMenu
                : void 0),
                (this.menu.direction = this.dir),
                this._setMenuElevation(),
                this.menu.focusFirstItem(this._openedBy || "program"),
                this._setIsMenuOpen(!0);
            }
            _setMenuElevation() {
              if (this.menu.setElevation) {
                let e = 0,
                  r = this.menu.parentMenu;
                for (; r; ) e++, (r = r.parentMenu);
                this.menu.setElevation(e);
              }
            }
            _setIsMenuOpen(e) {
              (this._menuOpen = e),
                this._menuOpen
                  ? this.menuOpened.emit()
                  : this.menuClosed.emit(),
                this.triggersSubmenu() &&
                  this._menuItemInstance._setHighlighted(e);
            }
            _checkMenu() {}
            _createOverlay() {
              if (!this._overlayRef) {
                const e = this._getOverlayConfig();
                this._subscribeToPositions(e.positionStrategy),
                  (this._overlayRef = this._overlay.create(e)),
                  this._overlayRef.keydownEvents().subscribe();
              }
              return this._overlayRef;
            }
            _getOverlayConfig() {
              return new wp({
                positionStrategy: this._overlay
                  .position()
                  .flexibleConnectedTo(this._element)
                  .withLockedPosition()
                  .withGrowAfterOpen()
                  .withTransformOriginOn(
                    ".mat-menu-panel, .mat-mdc-menu-panel",
                  ),
                backdropClass:
                  this.menu.backdropClass || "cdk-overlay-transparent-backdrop",
                panelClass: this.menu.overlayPanelClass,
                scrollStrategy: this._scrollStrategy(),
                direction: this._dir,
              });
            }
            _subscribeToPositions(e) {
              this.menu.setPositionClasses &&
                e.positionChanges.subscribe((r) => {
                  this.menu.setPositionClasses(
                    "start" === r.connectionPair.overlayX ? "after" : "before",
                    "top" === r.connectionPair.overlayY ? "below" : "above",
                  );
                });
            }
            _setPosition(e) {
              let [r, i] =
                  "before" === this.menu.xPosition
                    ? ["end", "start"]
                    : ["start", "end"],
                [s, o] =
                  "above" === this.menu.yPosition
                    ? ["bottom", "top"]
                    : ["top", "bottom"],
                [a, l] = [s, o],
                [c, u] = [r, i],
                d = 0;
              this.triggersSubmenu()
                ? ((u = r = "before" === this.menu.xPosition ? "start" : "end"),
                  (i = c = "end" === r ? "start" : "end"),
                  (d = "bottom" === s ? 8 : -8))
                : this.menu.overlapTrigger ||
                  ((a = "top" === s ? "bottom" : "top"),
                  (l = "top" === o ? "bottom" : "top")),
                e.withPositions([
                  {
                    originX: r,
                    originY: a,
                    overlayX: c,
                    overlayY: s,
                    offsetY: d,
                  },
                  {
                    originX: i,
                    originY: a,
                    overlayX: u,
                    overlayY: s,
                    offsetY: d,
                  },
                  {
                    originX: r,
                    originY: l,
                    overlayX: c,
                    overlayY: o,
                    offsetY: -d,
                  },
                  {
                    originX: i,
                    originY: l,
                    overlayX: u,
                    overlayY: o,
                    offsetY: -d,
                  },
                ]);
            }
            _menuClosingActions() {
              const e = this._overlayRef.backdropClick(),
                r = this._overlayRef.detachments();
              return Ns(
                e,
                this._parentMaterialMenu
                  ? this._parentMaterialMenu.closed
                  : k(),
                this._parentMaterialMenu
                  ? this._parentMaterialMenu._hovered().pipe(
                      Ze((o) => o !== this._menuItemInstance),
                      Ze(() => this._menuOpen),
                    )
                  : k(),
                r,
              );
            }
            _handleMousedown(e) {
              Tp(e) ||
                ((this._openedBy = 0 === e.button ? "mouse" : void 0),
                this.triggersSubmenu() && e.preventDefault());
            }
            _handleKeydown(e) {
              const r = e.keyCode;
              (13 === r || 32 === r) && (this._openedBy = "keyboard"),
                this.triggersSubmenu() &&
                  ((39 === r && "ltr" === this.dir) ||
                    (37 === r && "rtl" === this.dir)) &&
                  ((this._openedBy = "keyboard"), this.openMenu());
            }
            _handleClick(e) {
              this.triggersSubmenu()
                ? (e.stopPropagation(), this.openMenu())
                : this.toggleMenu();
            }
            _handleHover() {
              !this.triggersSubmenu() ||
                !this._parentMaterialMenu ||
                (this._hoverSubscription = this._parentMaterialMenu
                  ._hovered()
                  .pipe(
                    Ze((e) => e === this._menuItemInstance && !e.disabled),
                    d0(0, hp),
                  )
                  .subscribe(() => {
                    (this._openedBy = "mouse"),
                      this.menu instanceof ba && this.menu._isAnimating
                        ? this.menu._animationDone
                            .pipe(
                              Tt(1),
                              d0(0, hp),
                              xc(this._parentMaterialMenu._hovered()),
                            )
                            .subscribe(() => this.openMenu())
                        : this.openMenu();
                  }));
            }
            _getPortal() {
              return (
                (!this._portal ||
                  this._portal.templateRef !== this.menu.templateRef) &&
                  (this._portal = new bp(
                    this.menu.templateRef,
                    this._viewContainerRef,
                  )),
                this._portal
              );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                _(ys),
                _(Ie),
                _(Ut),
                _(p0),
                _(Ng, 8),
                _(hu, 10),
                _(Ic, 8),
                _(kc),
              );
            }),
            (n.ɵdir = F({
              type: n,
              hostAttrs: ["aria-haspopup", "true"],
              hostVars: 2,
              hostBindings: function (e, r) {
                1 & e &&
                  oe("click", function (s) {
                    return r._handleClick(s);
                  })("mousedown", function (s) {
                    return r._handleMousedown(s);
                  })("keydown", function (s) {
                    return r._handleKeydown(s);
                  }),
                  2 & e &&
                    et("aria-expanded", r.menuOpen || null)(
                      "aria-controls",
                      r.menuOpen ? r.menu.panelId : null,
                    );
              },
              inputs: {
                _deprecatedMatMenuTriggerFor: [
                  "mat-menu-trigger-for",
                  "_deprecatedMatMenuTriggerFor",
                ],
                menu: ["matMenuTriggerFor", "menu"],
                menuData: ["matMenuTriggerData", "menuData"],
                restoreFocus: ["matMenuTriggerRestoreFocus", "restoreFocus"],
              },
              outputs: {
                menuOpened: "menuOpened",
                onMenuOpen: "onMenuOpen",
                menuClosed: "menuClosed",
                onMenuClose: "onMenuClose",
              },
            })),
            n
          );
        })(),
        Tz = (() => {
          class n extends Az {}
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = We(n)))(r || n);
              };
            })()),
            (n.ɵdir = F({
              type: n,
              selectors: [
                ["", "mat-menu-trigger-for", ""],
                ["", "matMenuTriggerFor", ""],
              ],
              hostAttrs: [1, "mat-menu-trigger"],
              exportAs: ["matMenuTrigger"],
              features: [ne],
            })),
            n
          );
        })(),
        Iz = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = ve({ type: n })),
            (n.ɵinj = _e({
              providers: [Mz],
              imports: [[wD, Ln, sS, VE], _p, Ln],
            })),
            n
          );
        })();
      function Rz(n, t) {
        if (1 & n) {
          const e = es();
          E(0, "tr")(1, "td")(2, "a", 12),
            oe("click", function () {
              const s = Et(e).$implicit;
              return St(tt().onViewImposter(s.port));
            }),
            x(3),
            S()(),
            E(4, "td"),
            x(5),
            S(),
            E(6, "td"),
            x(7),
            S(),
            E(8, "td"),
            x(9),
            S(),
            E(10, "td")(11, "div", 13)(12, "mat-icon", 14),
            x(13, "more_horiz"),
            S()(),
            E(14, "mat-menu", null, 15)(16, "button", 16),
            oe("click", function () {
              const s = Et(e).$implicit;
              return St(tt().onViewImposter(s.port));
            }),
            E(17, "mat-icon"),
            x(18, "visibility"),
            S(),
            x(19, " View "),
            S(),
            E(20, "button", 16),
            oe("click", function () {
              const i = Et(e),
                s = i.$implicit,
                o = i.index;
              return St(tt().onDeleteImposter(s.port, o));
            }),
            E(21, "mat-icon"),
            x(22, "delete"),
            S(),
            x(23, " Delete "),
            S(),
            E(24, "button", 16),
            oe("click", function () {
              const s = Et(e).$implicit;
              return St(tt().openPostman(s.name));
            }),
            E(25, "mat-icon"),
            x(26, "open_in_new"),
            S(),
            x(27, " Open in Postman "),
            S()()()();
        }
        if (2 & n) {
          const e = t.$implicit,
            r = po(15);
          L(3),
            nt(e.name),
            L(2),
            nt(e.protocol),
            L(2),
            nt(e.port),
            L(2),
            nt(e.numberOfRequests),
            L(2),
            $("matMenuTriggerFor", r);
        }
      }
      const _0 = function (n) {
        return { color: n };
      };
      function xz(n, t) {
        if (1 & n) {
          const e = es();
          E(0, "button", 17),
            oe("click", function () {
              return Et(e), St(tt().onCopyJSON());
            }),
            E(1, "mat-icon", 18),
            x(2),
            S(),
            E(3, "span", 19),
            x(4),
            S()();
        }
        if (2 & n) {
          const e = tt();
          L(1),
            $("ngStyle", Hh(3, _0, e.copyJSONButtonColor)),
            L(1),
            nt(e.iconJSONName),
            L(2),
            nt(e.copyJSONButtonText);
        }
      }
      const Oz = [
        { path: "", redirectTo: "/home", pathMatch: "full" },
        {
          path: "home",
          component: (() => {
            class n {
              constructor(e, r, i, s, o) {
                (this.http = e),
                  (this.matDialogModule = r),
                  (this.imposterService = i),
                  (this.store = s),
                  (this.clipboard = o),
                  (this.imposterArray = []),
                  (this.viewDependency = ""),
                  (this.viewDependencyName = ""),
                  (this.isCopyAll = !1),
                  (this.copyAllButtonText = "Copy All"),
                  (this.copyJSONButtonText = "Copy JSON"),
                  (this.iconName = "file_copy"),
                  (this.iconJSONName = "file_copy"),
                  (this.copyAllButtonColor = "black"),
                  (this.copyJSONButtonColor = "black");
              }
              ngOnInit() {
                this.imposterService.onGetImposter().subscribe((r) => {
                  this.imposterArray = r;
                }),
                  this.store.dispatch(new o$(this.imposterArray)),
                  this.store.select("imposter").subscribe((r) => {});
              }
              onViewImposter(e) {
                this.imposterService.onViewImposter(e).subscribe((r) => {
                  (this.viewDependency = r),
                    (this.viewDependencyName = this.viewDependency.name);
                });
              }
              onAddImposter() {
                this.matDialogModule.open(s$);
              }
              onDeleteImposter(e, r) {
                this.imposterService.onDeleteImposter(e, r),
                  (this.viewDependency = ""),
                  (this.viewDependencyName = "");
              }
              onCopyJSON() {
                this.clipboard.copy(JSON.stringify(this.viewDependency)),
                  (this.copyJSONButtonText = "Copied!"),
                  (this.iconJSONName = "done"),
                  (this.copyJSONButtonColor = "green"),
                  setTimeout(() => {
                    (this.copyJSONButtonText = "Copy JSON"),
                      (this.iconJSONName = "file_copy"),
                      (this.copyJSONButtonColor = "black");
                  }, 2e3);
              }
              onCopyAll() {
                this.clipboard.copy(JSON.stringify(this.imposterArray)),
                  (this.copyAllButtonText = "Copied!"),
                  (this.iconName = "done"),
                  (this.copyAllButtonColor = "green"),
                  setTimeout(() => {
                    (this.copyAllButtonText = "Copy All"),
                      (this.iconName = "file_copy"),
                      (this.copyAllButtonColor = "black");
                  }, 2e3);
              }
              openPostman(e) {
                console.log("clicked"),
                  this.imposterService.onExportImposter(6001);
              }
            }
            return (
              (n.ɵfac = function (e) {
                return new (e || n)(_(ei), _(fS), _(fa), _(va), _(fz));
              }),
              (n.ɵcmp = Ot({
                type: n,
                selectors: [["app-home"]],
                decls: 41,
                vars: 11,
                consts: [
                  [2, "margin", "auto", "width", "80%"],
                  [2, "font-weight", "bold", "font-size", "xx-large"],
                  [
                    1,
                    "btn",
                    "btn-primary",
                    "add-dependency-button",
                    2,
                    "display",
                    "inline-flex",
                    "align-items",
                    "center",
                    "padding-left",
                    "0",
                    "padding-left",
                    "5px",
                    "margin-right",
                    "15px",
                    3,
                    "click",
                  ],
                  [2, "padding-right", "30px", "padding-left", "0"],
                  [
                    1,
                    "btn",
                    "btn-default",
                    2,
                    "display",
                    "inline-flex",
                    "align-items",
                    "center",
                    "padding-left",
                    "0",
                    "padding-left",
                    "5px",
                    3,
                    "click",
                  ],
                  [
                    2,
                    "padding-right",
                    "30px",
                    "padding-left",
                    "0",
                    "transform",
                    "scale(.8)",
                    3,
                    "ngStyle",
                  ],
                  [2, "overflow-x", "auto"],
                  [1, "table", "table-striped"],
                  [4, "ngFor", "ngForOf"],
                  [2, "font-weight", "bold"],
                  [2, "position", "relative"],
                  [
                    "class",
                    "btn btn-default copy-button",
                    "style",
                    "position: absolute; top: 0; right: 0; display: flex; align-items: center; background: transparent; border: none; padding-bottom: 15px;",
                    3,
                    "click",
                    4,
                    "ngIf",
                  ],
                  [2, "cursor", "pointer", 3, "click"],
                  [3, "matMenuTriggerFor"],
                  [
                    "role",
                    "button",
                    1,
                    "dropdown-toggle",
                    2,
                    "cursor",
                    "pointer",
                  ],
                  ["menu", "matMenu"],
                  ["mat-menu-item", "", 3, "click"],
                  [
                    1,
                    "btn",
                    "btn-default",
                    "copy-button",
                    2,
                    "position",
                    "absolute",
                    "top",
                    "0",
                    "right",
                    "0",
                    "display",
                    "flex",
                    "align-items",
                    "center",
                    "background",
                    "transparent",
                    "border",
                    "none",
                    "padding-bottom",
                    "15px",
                    3,
                    "click",
                  ],
                  [
                    2,
                    "padding-top",
                    "5px",
                    "transform",
                    "scale(.8)",
                    3,
                    "ngStyle",
                  ],
                  [
                    2,
                    "padding-top",
                    "5px",
                    "padding-left",
                    "5px",
                    "padding-right",
                    "5px",
                    "font-family",
                    "monospace",
                    "font-size",
                    "14px",
                  ],
                ],
                template: function (e, r) {
                  1 & e &&
                    (E(0, "div", 0)(1, "h1", 1),
                    x(2, "Environment Simulator Tool"),
                    S(),
                    E(3, "p"),
                    x(
                      4,
                      "Add dependencies to create mock API services that simulate requests/responses for integration development and testing.",
                    ),
                    S(),
                    X(5, "br"),
                    E(6, "button", 2),
                    oe("click", function () {
                      return r.onAddImposter();
                    }),
                    E(7, "mat-icon", 3),
                    x(8, "add"),
                    S(),
                    x(9, "Add Dependency"),
                    S(),
                    E(10, "button", 4),
                    oe("click", function () {
                      return r.onCopyAll();
                    }),
                    E(11, "mat-icon", 5),
                    x(12),
                    S(),
                    x(13),
                    S(),
                    X(14, "br")(15, "br"),
                    E(16, "div", 6)(17, "table", 7)(18, "thead")(19, "tr")(
                      20,
                      "th",
                    ),
                    x(21, "Name"),
                    S(),
                    E(22, "th"),
                    x(23, "Protocol"),
                    S(),
                    E(24, "th"),
                    x(25, "Port"),
                    S(),
                    E(26, "th"),
                    x(27, "# of Requests"),
                    S(),
                    E(28, "th"),
                    x(29, "More"),
                    S()()(),
                    E(30, "tbody"),
                    Xe(31, Rz, 28, 5, "tr", 8),
                    S()()(),
                    X(32, "br"),
                    E(33, "div", 9),
                    x(34),
                    S(),
                    X(35, "br"),
                    E(36, "div", 10),
                    Xe(37, xz, 5, 5, "button", 11),
                    E(38, "pre"),
                    x(39),
                    xl(40, "json"),
                    S()()()),
                    2 & e &&
                      (L(11),
                      $("ngStyle", Hh(9, _0, r.copyAllButtonColor)),
                      L(1),
                      nt(r.iconName),
                      L(1),
                      nt(r.copyAllButtonText),
                      L(18),
                      $("ngForOf", r.imposterArray),
                      L(3),
                      br(" Request Stub: ", r.viewDependency.name, " "),
                      L(3),
                      $("ngIf", r.viewDependency),
                      L(2),
                      nt(Ol(40, 7, r.viewDependency)));
                },
                dependencies: [Fo, Af, CD, au, Ez, hu, Tz, Rf],
                styles: [
                  ".center[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}@media screen and (max-width: 396px){.add-dependency-button[_ngcontent-%COMP%]{margin-bottom:15px}}",
                ],
              })),
              n
            );
          })(),
          children: [],
        },
      ];
      let kz = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵmod = ve({ type: n })),
          (n.ɵinj = _e({ imports: [EM.forRoot(Oz), EM] })),
          n
        );
      })();
      function y0(n) {
        return new C(3e3, !1);
      }
      function g3() {
        return typeof window < "u" && typeof window.document < "u";
      }
      function Lg() {
        return (
          typeof process < "u" &&
          "[object process]" === {}.toString.call(process)
        );
      }
      function Or(n) {
        switch (n.length) {
          case 0:
            return new Jo();
          case 1:
            return n[0];
          default:
            return new cS(n);
        }
      }
      function v0(n, t, e, r, i = new Map(), s = new Map()) {
        const o = [],
          a = [];
        let l = -1,
          c = null;
        if (
          (r.forEach((u) => {
            const d = u.get("offset"),
              h = d == l,
              f = (h && c) || new Map();
            u.forEach((p, g) => {
              let y = g,
                b = p;
              if ("offset" !== g)
                switch (((y = t.normalizePropertyName(y, o)), b)) {
                  case "!":
                    b = i.get(g);
                    break;
                  case sr:
                    b = s.get(g);
                    break;
                  default:
                    b = t.normalizeStyleValue(g, y, b, o);
                }
              f.set(y, b);
            }),
              h || a.push(f),
              (c = f),
              (l = d);
          }),
          o.length)
        )
          throw (function n3(n) {
            return new C(3502, !1);
          })();
        return a;
      }
      function Vg(n, t, e, r) {
        switch (t) {
          case "start":
            n.onStart(() => r(e && Bg(e, "start", n)));
            break;
          case "done":
            n.onDone(() => r(e && Bg(e, "done", n)));
            break;
          case "destroy":
            n.onDestroy(() => r(e && Bg(e, "destroy", n)));
        }
      }
      function Bg(n, t, e) {
        const s = jg(
            n.element,
            n.triggerName,
            n.fromState,
            n.toState,
            t || n.phaseName,
            e.totalTime ?? n.totalTime,
            !!e.disabled,
          ),
          o = n._data;
        return null != o && (s._data = o), s;
      }
      function jg(n, t, e, r, i = "", s = 0, o) {
        return {
          element: n,
          triggerName: t,
          fromState: e,
          toState: r,
          phaseName: i,
          totalTime: s,
          disabled: !!o,
        };
      }
      function $t(n, t, e) {
        let r = n.get(t);
        return r || n.set(t, (r = e)), r;
      }
      function b0(n) {
        const t = n.indexOf(":");
        return [n.substring(1, t), n.slice(t + 1)];
      }
      let Ug = (n, t) => !1,
        C0 = (n, t, e) => [],
        D0 = null;
      function Hg(n) {
        const t = n.parentNode || n.host;
        return t === D0 ? null : t;
      }
      (Lg() || typeof Element < "u") &&
        (g3()
          ? ((D0 = (() => document.documentElement)()),
            (Ug = (n, t) => {
              for (; t; ) {
                if (t === n) return !0;
                t = Hg(t);
              }
              return !1;
            }))
          : (Ug = (n, t) => n.contains(t)),
        (C0 = (n, t, e) => {
          if (e) return Array.from(n.querySelectorAll(t));
          const r = n.querySelector(t);
          return r ? [r] : [];
        }));
      let hi = null,
        w0 = !1;
      const E0 = Ug,
        S0 = C0;
      let M0 = (() => {
          class n {
            validateStyleProperty(e) {
              return (function _3(n) {
                hi ||
                  ((hi =
                    (function y3() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (w0 = !!hi.style && "WebkitAppearance" in hi.style));
                let t = !0;
                return (
                  hi.style &&
                    !(function m3(n) {
                      return "ebkit" == n.substring(1, 6);
                    })(n) &&
                    ((t = n in hi.style),
                    !t &&
                      w0 &&
                      (t =
                        "Webkit" + n.charAt(0).toUpperCase() + n.slice(1) in
                        hi.style)),
                  t
                );
              })(e);
            }
            matchesElement(e, r) {
              return !1;
            }
            containsElement(e, r) {
              return E0(e, r);
            }
            getParentElement(e) {
              return Hg(e);
            }
            query(e, r, i) {
              return S0(e, r, i);
            }
            computeStyle(e, r, i) {
              return i || "";
            }
            animate(e, r, i, s, o, a = [], l) {
              return new Jo(i, s);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = A({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        $g = (() => {
          class n {}
          return (n.NOOP = new M0()), n;
        })();
      const zg = "ng-enter",
        fu = "ng-leave",
        pu = "ng-trigger",
        gu = ".ng-trigger",
        T0 = "ng-animating",
        Gg = ".ng-animating";
      function lr(n) {
        if ("number" == typeof n) return n;
        const t = n.match(/^(-?[\.\d]+)(m?s)/);
        return !t || t.length < 2 ? 0 : Wg(parseFloat(t[1]), t[2]);
      }
      function Wg(n, t) {
        return "s" === t ? 1e3 * n : n;
      }
      function mu(n, t, e) {
        return n.hasOwnProperty("duration")
          ? n
          : (function C3(n, t, e) {
              let i,
                s = 0,
                o = "";
              if ("string" == typeof n) {
                const a = n.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
                );
                if (null === a)
                  return t.push(y0()), { duration: 0, delay: 0, easing: "" };
                i = Wg(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (s = Wg(parseFloat(l), a[4]));
                const c = a[5];
                c && (o = c);
              } else i = n;
              if (!e) {
                let a = !1,
                  l = t.length;
                i < 0 &&
                  (t.push(
                    (function Fz() {
                      return new C(3100, !1);
                    })(),
                  ),
                  (a = !0)),
                  s < 0 &&
                    (t.push(
                      (function Pz() {
                        return new C(3101, !1);
                      })(),
                    ),
                    (a = !0)),
                  a && t.splice(l, 0, y0());
              }
              return { duration: i, delay: s, easing: o };
            })(n, t, e);
      }
      function Ca(n, t = {}) {
        return (
          Object.keys(n).forEach((e) => {
            t[e] = n[e];
          }),
          t
        );
      }
      function I0(n) {
        const t = new Map();
        return (
          Object.keys(n).forEach((e) => {
            t.set(e, n[e]);
          }),
          t
        );
      }
      function kr(n, t = new Map(), e) {
        if (e) for (let [r, i] of e) t.set(r, i);
        for (let [r, i] of n) t.set(r, i);
        return t;
      }
      function x0(n, t, e) {
        return e ? t + ":" + e + ";" : "";
      }
      function O0(n) {
        let t = "";
        for (let e = 0; e < n.style.length; e++) {
          const r = n.style.item(e);
          t += x0(0, r, n.style.getPropertyValue(r));
        }
        for (const e in n.style)
          n.style.hasOwnProperty(e) &&
            !e.startsWith("_") &&
            (t += x0(0, S3(e), n.style[e]));
        n.setAttribute("style", t);
      }
      function Bn(n, t, e) {
        n.style &&
          (t.forEach((r, i) => {
            const s = Kg(i);
            e && !e.has(i) && e.set(i, n.style[s]), (n.style[s] = r);
          }),
          Lg() && O0(n));
      }
      function fi(n, t) {
        n.style &&
          (t.forEach((e, r) => {
            const i = Kg(r);
            n.style[i] = "";
          }),
          Lg() && O0(n));
      }
      function Da(n) {
        return Array.isArray(n) ? (1 == n.length ? n[0] : aS(n)) : n;
      }
      const qg = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function k0(n) {
        let t = [];
        if ("string" == typeof n) {
          let e;
          for (; (e = qg.exec(n)); ) t.push(e[1]);
          qg.lastIndex = 0;
        }
        return t;
      }
      function wa(n, t, e) {
        const r = n.toString(),
          i = r.replace(qg, (s, o) => {
            let a = t[o];
            return (
              null == a &&
                (e.push(
                  (function Lz(n) {
                    return new C(3003, !1);
                  })(),
                ),
                (a = "")),
              a.toString()
            );
          });
        return i == r ? n : i;
      }
      function _u(n) {
        const t = [];
        let e = n.next();
        for (; !e.done; ) t.push(e.value), (e = n.next());
        return t;
      }
      const E3 = /-+([a-z0-9])/g;
      function Kg(n) {
        return n.replace(E3, (...t) => t[1].toUpperCase());
      }
      function S3(n) {
        return n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function zt(n, t, e) {
        switch (t.type) {
          case 7:
            return n.visitTrigger(t, e);
          case 0:
            return n.visitState(t, e);
          case 1:
            return n.visitTransition(t, e);
          case 2:
            return n.visitSequence(t, e);
          case 3:
            return n.visitGroup(t, e);
          case 4:
            return n.visitAnimate(t, e);
          case 5:
            return n.visitKeyframes(t, e);
          case 6:
            return n.visitStyle(t, e);
          case 8:
            return n.visitReference(t, e);
          case 9:
            return n.visitAnimateChild(t, e);
          case 10:
            return n.visitAnimateRef(t, e);
          case 11:
            return n.visitQuery(t, e);
          case 12:
            return n.visitStagger(t, e);
          default:
            throw (function Vz(n) {
              return new C(3004, !1);
            })();
        }
      }
      function F0(n, t) {
        return window.getComputedStyle(n)[t];
      }
      function x3(n, t) {
        const e = [];
        return (
          "string" == typeof n
            ? n.split(/\s*,\s*/).forEach((r) =>
                (function O3(n, t, e) {
                  if (":" == n[0]) {
                    const l = (function k3(n, t) {
                      switch (n) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (e, r) => parseFloat(r) > parseFloat(e);
                        case ":decrement":
                          return (e, r) => parseFloat(r) < parseFloat(e);
                        default:
                          return (
                            t.push(
                              (function Xz(n) {
                                return new C(3016, !1);
                              })(),
                            ),
                            "* => *"
                          );
                      }
                    })(n, e);
                    if ("function" == typeof l) return void t.push(l);
                    n = l;
                  }
                  const r = n.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == r || r.length < 4)
                    return (
                      e.push(
                        (function Qz(n) {
                          return new C(3015, !1);
                        })(),
                      ),
                      t
                    );
                  const i = r[1],
                    s = r[2],
                    o = r[3];
                  t.push(P0(i, o));
                  "<" == s[0] && !("*" == i && "*" == o) && t.push(P0(o, i));
                })(r, e, t),
              )
            : e.push(n),
          e
        );
      }
      const Cu = new Set(["true", "1"]),
        Du = new Set(["false", "0"]);
      function P0(n, t) {
        const e = Cu.has(n) || Du.has(n),
          r = Cu.has(t) || Du.has(t);
        return (i, s) => {
          let o = "*" == n || n == i,
            a = "*" == t || t == s;
          return (
            !o && e && "boolean" == typeof i && (o = i ? Cu.has(n) : Du.has(n)),
            !a && r && "boolean" == typeof s && (a = s ? Cu.has(t) : Du.has(t)),
            o && a
          );
        };
      }
      const F3 = new RegExp("s*:selfs*,?", "g");
      function Yg(n, t, e, r) {
        return new P3(n).build(t, e, r);
      }
      class P3 {
        constructor(t) {
          this._driver = t;
        }
        build(t, e, r) {
          const i = new V3(e);
          return this._resetContextStyleTimingState(i), zt(this, Da(t), i);
        }
        _resetContextStyleTimingState(t) {
          (t.currentQuerySelector = ""),
            (t.collectedStyles = new Map()),
            t.collectedStyles.set("", new Map()),
            (t.currentTime = 0);
        }
        visitTrigger(t, e) {
          let r = (e.queryCount = 0),
            i = (e.depCount = 0);
          const s = [],
            o = [];
          return (
            "@" == t.name.charAt(0) &&
              e.errors.push(
                (function jz() {
                  return new C(3006, !1);
                })(),
              ),
            t.definitions.forEach((a) => {
              if ((this._resetContextStyleTimingState(e), 0 == a.type)) {
                const l = a,
                  c = l.name;
                c
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach((u) => {
                    (l.name = u), s.push(this.visitState(l, e));
                  }),
                  (l.name = c);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, e);
                (r += l.queryCount), (i += l.depCount), o.push(l);
              } else
                e.errors.push(
                  (function Uz() {
                    return new C(3007, !1);
                  })(),
                );
            }),
            {
              type: 7,
              name: t.name,
              states: s,
              transitions: o,
              queryCount: r,
              depCount: i,
              options: null,
            }
          );
        }
        visitState(t, e) {
          const r = this.visitStyle(t.styles, e),
            i = (t.options && t.options.params) || null;
          if (r.containsDynamicStyles) {
            const s = new Set(),
              o = i || {};
            r.styles.forEach((a) => {
              a instanceof Map &&
                a.forEach((l) => {
                  k0(l).forEach((c) => {
                    o.hasOwnProperty(c) || s.add(c);
                  });
                });
            }),
              s.size &&
                (_u(s.values()),
                e.errors.push(
                  (function Hz(n, t) {
                    return new C(3008, !1);
                  })(),
                ));
          }
          return {
            type: 0,
            name: t.name,
            style: r,
            options: i ? { params: i } : null,
          };
        }
        visitTransition(t, e) {
          (e.queryCount = 0), (e.depCount = 0);
          const r = zt(this, Da(t.animation), e);
          return {
            type: 1,
            matchers: x3(t.expr, e.errors),
            animation: r,
            queryCount: e.queryCount,
            depCount: e.depCount,
            options: pi(t.options),
          };
        }
        visitSequence(t, e) {
          return {
            type: 2,
            steps: t.steps.map((r) => zt(this, r, e)),
            options: pi(t.options),
          };
        }
        visitGroup(t, e) {
          const r = e.currentTime;
          let i = 0;
          const s = t.steps.map((o) => {
            e.currentTime = r;
            const a = zt(this, o, e);
            return (i = Math.max(i, e.currentTime)), a;
          });
          return (
            (e.currentTime = i), { type: 3, steps: s, options: pi(t.options) }
          );
        }
        visitAnimate(t, e) {
          const r = (function j3(n, t) {
            if (n.hasOwnProperty("duration")) return n;
            if ("number" == typeof n) return Zg(mu(n, t).duration, 0, "");
            const e = n;
            if (
              e
                .split(/\s+/)
                .some((s) => "{" == s.charAt(0) && "{" == s.charAt(1))
            ) {
              const s = Zg(0, 0, "");
              return (s.dynamic = !0), (s.strValue = e), s;
            }
            const i = mu(e, t);
            return Zg(i.duration, i.delay, i.easing);
          })(t.timings, e.errors);
          e.currentAnimateTimings = r;
          let i,
            s = t.styles ? t.styles : Dn({});
          if (5 == s.type) i = this.visitKeyframes(s, e);
          else {
            let o = t.styles,
              a = !1;
            if (!o) {
              a = !0;
              const c = {};
              r.easing && (c.easing = r.easing), (o = Dn(c));
            }
            e.currentTime += r.duration + r.delay;
            const l = this.visitStyle(o, e);
            (l.isEmptyStep = a), (i = l);
          }
          return (
            (e.currentAnimateTimings = null),
            { type: 4, timings: r, style: i, options: null }
          );
        }
        visitStyle(t, e) {
          const r = this._makeStyleAst(t, e);
          return this._validateStyleAst(r, e), r;
        }
        _makeStyleAst(t, e) {
          const r = [],
            i = Array.isArray(t.styles) ? t.styles : [t.styles];
          for (let a of i)
            "string" == typeof a
              ? a === sr
                ? r.push(a)
                : e.errors.push(new C(3002, !1))
              : r.push(I0(a));
          let s = !1,
            o = null;
          return (
            r.forEach((a) => {
              if (
                a instanceof Map &&
                (a.has("easing") && ((o = a.get("easing")), a.delete("easing")),
                !s)
              )
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    s = !0;
                    break;
                  }
            }),
            {
              type: 6,
              styles: r,
              easing: o,
              offset: t.offset,
              containsDynamicStyles: s,
              options: null,
            }
          );
        }
        _validateStyleAst(t, e) {
          const r = e.currentAnimateTimings;
          let i = e.currentTime,
            s = e.currentTime;
          r && s > 0 && (s -= r.duration + r.delay),
            t.styles.forEach((o) => {
              "string" != typeof o &&
                o.forEach((a, l) => {
                  const c = e.collectedStyles.get(e.currentQuerySelector),
                    u = c.get(l);
                  let d = !0;
                  u &&
                    (s != i &&
                      s >= u.startTime &&
                      i <= u.endTime &&
                      (e.errors.push(
                        (function zz(n, t, e, r, i) {
                          return new C(3010, !1);
                        })(),
                      ),
                      (d = !1)),
                    (s = u.startTime)),
                    d && c.set(l, { startTime: s, endTime: i }),
                    e.options &&
                      (function w3(n, t, e) {
                        const r = t.params || {},
                          i = k0(n);
                        i.length &&
                          i.forEach((s) => {
                            r.hasOwnProperty(s) ||
                              e.push(
                                (function Nz(n) {
                                  return new C(3001, !1);
                                })(),
                              );
                          });
                      })(a, e.options, e.errors);
                });
            });
        }
        visitKeyframes(t, e) {
          const r = { type: 5, styles: [], options: null };
          if (!e.currentAnimateTimings)
            return (
              e.errors.push(
                (function Gz() {
                  return new C(3011, !1);
                })(),
              ),
              r
            );
          let s = 0;
          const o = [];
          let a = !1,
            l = !1,
            c = 0;
          const u = t.steps.map((b) => {
            const M = this._makeStyleAst(b, e);
            let v =
                null != M.offset
                  ? M.offset
                  : (function B3(n) {
                      if ("string" == typeof n) return null;
                      let t = null;
                      if (Array.isArray(n))
                        n.forEach((e) => {
                          if (e instanceof Map && e.has("offset")) {
                            const r = e;
                            (t = parseFloat(r.get("offset"))),
                              r.delete("offset");
                          }
                        });
                      else if (n instanceof Map && n.has("offset")) {
                        const e = n;
                        (t = parseFloat(e.get("offset"))), e.delete("offset");
                      }
                      return t;
                    })(M.styles),
              T = 0;
            return (
              null != v && (s++, (T = M.offset = v)),
              (l = l || T < 0 || T > 1),
              (a = a || T < c),
              (c = T),
              o.push(T),
              M
            );
          });
          l &&
            e.errors.push(
              (function Wz() {
                return new C(3012, !1);
              })(),
            ),
            a &&
              e.errors.push(
                (function qz() {
                  return new C(3200, !1);
                })(),
              );
          const d = t.steps.length;
          let h = 0;
          s > 0 && s < d
            ? e.errors.push(
                (function Kz() {
                  return new C(3202, !1);
                })(),
              )
            : 0 == s && (h = 1 / (d - 1));
          const f = d - 1,
            p = e.currentTime,
            g = e.currentAnimateTimings,
            y = g.duration;
          return (
            u.forEach((b, M) => {
              const v = h > 0 ? (M == f ? 1 : h * M) : o[M],
                T = v * y;
              (e.currentTime = p + g.delay + T),
                (g.duration = T),
                this._validateStyleAst(b, e),
                (b.offset = v),
                r.styles.push(b);
            }),
            r
          );
        }
        visitReference(t, e) {
          return {
            type: 8,
            animation: zt(this, Da(t.animation), e),
            options: pi(t.options),
          };
        }
        visitAnimateChild(t, e) {
          return e.depCount++, { type: 9, options: pi(t.options) };
        }
        visitAnimateRef(t, e) {
          return {
            type: 10,
            animation: this.visitReference(t.animation, e),
            options: pi(t.options),
          };
        }
        visitQuery(t, e) {
          const r = e.currentQuerySelector,
            i = t.options || {};
          e.queryCount++, (e.currentQuery = t);
          const [s, o] = (function N3(n) {
            const t = !!n.split(/\s*,\s*/).find((e) => ":self" == e);
            return (
              t && (n = n.replace(F3, "")),
              (n = n
                .replace(/@\*/g, gu)
                .replace(/@\w+/g, (e) => gu + "-" + e.slice(1))
                .replace(/:animating/g, Gg)),
              [n, t]
            );
          })(t.selector);
          (e.currentQuerySelector = r.length ? r + " " + s : s),
            $t(e.collectedStyles, e.currentQuerySelector, new Map());
          const a = zt(this, Da(t.animation), e);
          return (
            (e.currentQuery = null),
            (e.currentQuerySelector = r),
            {
              type: 11,
              selector: s,
              limit: i.limit || 0,
              optional: !!i.optional,
              includeSelf: o,
              animation: a,
              originalSelector: t.selector,
              options: pi(t.options),
            }
          );
        }
        visitStagger(t, e) {
          e.currentQuery ||
            e.errors.push(
              (function Yz() {
                return new C(3013, !1);
              })(),
            );
          const r =
            "full" === t.timings
              ? { duration: 0, delay: 0, easing: "full" }
              : mu(t.timings, e.errors, !0);
          return {
            type: 12,
            animation: zt(this, Da(t.animation), e),
            timings: r,
            options: null,
          };
        }
      }
      class V3 {
        constructor(t) {
          (this.errors = t),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function pi(n) {
        return (
          n
            ? (n = Ca(n)).params &&
              (n.params = (function L3(n) {
                return n ? Ca(n) : null;
              })(n.params))
            : (n = {}),
          n
        );
      }
      function Zg(n, t, e) {
        return { duration: n, delay: t, easing: e };
      }
      function Qg(n, t, e, r, i, s, o = null, a = !1) {
        return {
          type: 1,
          element: n,
          keyframes: t,
          preStyleProps: e,
          postStyleProps: r,
          duration: i,
          delay: s,
          totalTime: i + s,
          easing: o,
          subTimeline: a,
        };
      }
      class wu {
        constructor() {
          this._map = new Map();
        }
        get(t) {
          return this._map.get(t) || [];
        }
        append(t, e) {
          let r = this._map.get(t);
          r || this._map.set(t, (r = [])), r.push(...e);
        }
        has(t) {
          return this._map.has(t);
        }
        clear() {
          this._map.clear();
        }
      }
      const $3 = new RegExp(":enter", "g"),
        G3 = new RegExp(":leave", "g");
      function Xg(n, t, e, r, i, s = new Map(), o = new Map(), a, l, c = []) {
        return new W3().buildKeyframes(n, t, e, r, i, s, o, a, l, c);
      }
      class W3 {
        buildKeyframes(t, e, r, i, s, o, a, l, c, u = []) {
          c = c || new wu();
          const d = new Jg(t, e, c, i, s, u, []);
          d.options = l;
          const h = l.delay ? lr(l.delay) : 0;
          d.currentTimeline.delayNextStep(h),
            d.currentTimeline.setStyles([o], null, d.errors, l),
            zt(this, r, d);
          const f = d.timelines.filter((p) => p.containsAnimation());
          if (f.length && a.size) {
            let p;
            for (let g = f.length - 1; g >= 0; g--) {
              const y = f[g];
              if (y.element === e) {
                p = y;
                break;
              }
            }
            p &&
              !p.allowOnlyTimelineStyles() &&
              p.setStyles([a], null, d.errors, l);
          }
          return f.length
            ? f.map((p) => p.buildKeyframes())
            : [Qg(e, [], [], [], 0, h, "", !1)];
        }
        visitTrigger(t, e) {}
        visitState(t, e) {}
        visitTransition(t, e) {}
        visitAnimateChild(t, e) {
          const r = e.subInstructions.get(e.element);
          if (r) {
            const i = e.createSubContext(t.options),
              s = e.currentTimeline.currentTime,
              o = this._visitSubInstructions(r, i, i.options);
            s != o && e.transformIntoNewTimeline(o);
          }
          e.previousNode = t;
        }
        visitAnimateRef(t, e) {
          const r = e.createSubContext(t.options);
          r.transformIntoNewTimeline(),
            this._applyAnimationRefDelays(
              [t.options, t.animation.options],
              e,
              r,
            ),
            this.visitReference(t.animation, r),
            e.transformIntoNewTimeline(r.currentTimeline.currentTime),
            (e.previousNode = t);
        }
        _applyAnimationRefDelays(t, e, r) {
          for (const i of t) {
            const s = i?.delay;
            if (s) {
              const o =
                "number" == typeof s ? s : lr(wa(s, i?.params ?? {}, e.errors));
              r.delayNextStep(o);
            }
          }
        }
        _visitSubInstructions(t, e, r) {
          let s = e.currentTimeline.currentTime;
          const o = null != r.duration ? lr(r.duration) : null,
            a = null != r.delay ? lr(r.delay) : null;
          return (
            0 !== o &&
              t.forEach((l) => {
                const c = e.appendInstructionToTimeline(l, o, a);
                s = Math.max(s, c.duration + c.delay);
              }),
            s
          );
        }
        visitReference(t, e) {
          e.updateOptions(t.options, !0),
            zt(this, t.animation, e),
            (e.previousNode = t);
        }
        visitSequence(t, e) {
          const r = e.subContextCount;
          let i = e;
          const s = t.options;
          if (
            s &&
            (s.params || s.delay) &&
            ((i = e.createSubContext(s)),
            i.transformIntoNewTimeline(),
            null != s.delay)
          ) {
            6 == i.previousNode.type &&
              (i.currentTimeline.snapshotCurrentStyles(),
              (i.previousNode = Eu));
            const o = lr(s.delay);
            i.delayNextStep(o);
          }
          t.steps.length &&
            (t.steps.forEach((o) => zt(this, o, i)),
            i.currentTimeline.applyStylesToKeyframe(),
            i.subContextCount > r && i.transformIntoNewTimeline()),
            (e.previousNode = t);
        }
        visitGroup(t, e) {
          const r = [];
          let i = e.currentTimeline.currentTime;
          const s = t.options && t.options.delay ? lr(t.options.delay) : 0;
          t.steps.forEach((o) => {
            const a = e.createSubContext(t.options);
            s && a.delayNextStep(s),
              zt(this, o, a),
              (i = Math.max(i, a.currentTimeline.currentTime)),
              r.push(a.currentTimeline);
          }),
            r.forEach((o) => e.currentTimeline.mergeTimelineCollectedStyles(o)),
            e.transformIntoNewTimeline(i),
            (e.previousNode = t);
        }
        _visitTiming(t, e) {
          if (t.dynamic) {
            const r = t.strValue;
            return mu(e.params ? wa(r, e.params, e.errors) : r, e.errors);
          }
          return { duration: t.duration, delay: t.delay, easing: t.easing };
        }
        visitAnimate(t, e) {
          const r = (e.currentAnimateTimings = this._visitTiming(t.timings, e)),
            i = e.currentTimeline;
          r.delay && (e.incrementTime(r.delay), i.snapshotCurrentStyles());
          const s = t.style;
          5 == s.type
            ? this.visitKeyframes(s, e)
            : (e.incrementTime(r.duration),
              this.visitStyle(s, e),
              i.applyStylesToKeyframe()),
            (e.currentAnimateTimings = null),
            (e.previousNode = t);
        }
        visitStyle(t, e) {
          const r = e.currentTimeline,
            i = e.currentAnimateTimings;
          !i && r.hasCurrentStyleProperties() && r.forwardFrame();
          const s = (i && i.easing) || t.easing;
          t.isEmptyStep
            ? r.applyEmptyStep(s)
            : r.setStyles(t.styles, s, e.errors, e.options),
            (e.previousNode = t);
        }
        visitKeyframes(t, e) {
          const r = e.currentAnimateTimings,
            i = e.currentTimeline.duration,
            s = r.duration,
            a = e.createSubContext().currentTimeline;
          (a.easing = r.easing),
            t.styles.forEach((l) => {
              a.forwardTime((l.offset || 0) * s),
                a.setStyles(l.styles, l.easing, e.errors, e.options),
                a.applyStylesToKeyframe();
            }),
            e.currentTimeline.mergeTimelineCollectedStyles(a),
            e.transformIntoNewTimeline(i + s),
            (e.previousNode = t);
        }
        visitQuery(t, e) {
          const r = e.currentTimeline.currentTime,
            i = t.options || {},
            s = i.delay ? lr(i.delay) : 0;
          s &&
            (6 === e.previousNode.type ||
              (0 == r && e.currentTimeline.hasCurrentStyleProperties())) &&
            (e.currentTimeline.snapshotCurrentStyles(), (e.previousNode = Eu));
          let o = r;
          const a = e.invokeQuery(
            t.selector,
            t.originalSelector,
            t.limit,
            t.includeSelf,
            !!i.optional,
            e.errors,
          );
          e.currentQueryTotal = a.length;
          let l = null;
          a.forEach((c, u) => {
            e.currentQueryIndex = u;
            const d = e.createSubContext(t.options, c);
            s && d.delayNextStep(s),
              c === e.element && (l = d.currentTimeline),
              zt(this, t.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (o = Math.max(o, d.currentTimeline.currentTime));
          }),
            (e.currentQueryIndex = 0),
            (e.currentQueryTotal = 0),
            e.transformIntoNewTimeline(o),
            l &&
              (e.currentTimeline.mergeTimelineCollectedStyles(l),
              e.currentTimeline.snapshotCurrentStyles()),
            (e.previousNode = t);
        }
        visitStagger(t, e) {
          const r = e.parentContext,
            i = e.currentTimeline,
            s = t.timings,
            o = Math.abs(s.duration),
            a = o * (e.currentQueryTotal - 1);
          let l = o * e.currentQueryIndex;
          switch (s.duration < 0 ? "reverse" : s.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime;
          }
          const u = e.currentTimeline;
          l && u.delayNextStep(l);
          const d = u.currentTime;
          zt(this, t.animation, e),
            (e.previousNode = t),
            (r.currentStaggerTime =
              i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
        }
      }
      const Eu = {};
      class Jg {
        constructor(t, e, r, i, s, o, a, l) {
          (this._driver = t),
            (this.element = e),
            (this.subInstructions = r),
            (this._enterClassName = i),
            (this._leaveClassName = s),
            (this.errors = o),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Eu),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new Su(this._driver, e, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(t, e) {
          if (!t) return;
          const r = t;
          let i = this.options;
          null != r.duration && (i.duration = lr(r.duration)),
            null != r.delay && (i.delay = lr(r.delay));
          const s = r.params;
          if (s) {
            let o = i.params;
            o || (o = this.options.params = {}),
              Object.keys(s).forEach((a) => {
                (!e || !o.hasOwnProperty(a)) &&
                  (o[a] = wa(s[a], o, this.errors));
              });
          }
        }
        _copyOptions() {
          const t = {};
          if (this.options) {
            const e = this.options.params;
            if (e) {
              const r = (t.params = {});
              Object.keys(e).forEach((i) => {
                r[i] = e[i];
              });
            }
          }
          return t;
        }
        createSubContext(t = null, e, r) {
          const i = e || this.element,
            s = new Jg(
              this._driver,
              i,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(i, r || 0),
            );
          return (
            (s.previousNode = this.previousNode),
            (s.currentAnimateTimings = this.currentAnimateTimings),
            (s.options = this._copyOptions()),
            s.updateOptions(t),
            (s.currentQueryIndex = this.currentQueryIndex),
            (s.currentQueryTotal = this.currentQueryTotal),
            (s.parentContext = this),
            this.subContextCount++,
            s
          );
        }
        transformIntoNewTimeline(t) {
          return (
            (this.previousNode = Eu),
            (this.currentTimeline = this.currentTimeline.fork(this.element, t)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(t, e, r) {
          const i = {
              duration: e ?? t.duration,
              delay: this.currentTimeline.currentTime + (r ?? 0) + t.delay,
              easing: "",
            },
            s = new q3(
              this._driver,
              t.element,
              t.keyframes,
              t.preStyleProps,
              t.postStyleProps,
              i,
              t.stretchStartingKeyframe,
            );
          return this.timelines.push(s), i;
        }
        incrementTime(t) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + t);
        }
        delayNextStep(t) {
          t > 0 && this.currentTimeline.delayNextStep(t);
        }
        invokeQuery(t, e, r, i, s, o) {
          let a = [];
          if ((i && a.push(this.element), t.length > 0)) {
            t = (t = t.replace($3, "." + this._enterClassName)).replace(
              G3,
              "." + this._leaveClassName,
            );
            let c = this._driver.query(this.element, t, 1 != r);
            0 !== r &&
              (c = r < 0 ? c.slice(c.length + r, c.length) : c.slice(0, r)),
              a.push(...c);
          }
          return (
            !s &&
              0 == a.length &&
              o.push(
                (function Zz(n) {
                  return new C(3014, !1);
                })(),
              ),
            a
          );
        }
      }
      class Su {
        constructor(t, e, r, i) {
          (this._driver = t),
            (this.element = e),
            (this.startTime = r),
            (this._elementTimelineStylesLookup = i),
            (this.duration = 0),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup ||
              (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles =
              this._elementTimelineStylesLookup.get(e)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(
                e,
                this._localTimelineStyles,
              )),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(t) {
          const e = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || e
            ? (this.forwardTime(this.currentTime + t),
              e && this.snapshotCurrentStyles())
            : (this.startTime += t);
        }
        fork(t, e) {
          return (
            this.applyStylesToKeyframe(),
            new Su(
              this._driver,
              t,
              e || this.currentTime,
              this._elementTimelineStylesLookup,
            )
          );
        }
        _loadKeyframe() {
          this._currentKeyframe &&
            (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(t) {
          this.applyStylesToKeyframe(),
            (this.duration = t),
            this._loadKeyframe();
        }
        _updateStyle(t, e) {
          this._localTimelineStyles.set(t, e),
            this._globalTimelineStyles.set(t, e),
            this._styleSummary.set(t, { time: this.currentTime, value: e });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(t) {
          t && this._previousKeyframe.set("easing", t);
          for (let [e, r] of this._globalTimelineStyles)
            this._backFill.set(e, r || sr), this._currentKeyframe.set(e, sr);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(t, e, r, i) {
          e && this._previousKeyframe.set("easing", e);
          const s = (i && i.params) || {},
            o = (function K3(n, t) {
              const e = new Map();
              let r;
              return (
                n.forEach((i) => {
                  if ("*" === i) {
                    r = r || t.keys();
                    for (let s of r) e.set(s, sr);
                  } else kr(i, e);
                }),
                e
              );
            })(t, this._globalTimelineStyles);
          for (let [a, l] of o) {
            const c = wa(l, s, r);
            this._pendingStyles.set(a, c),
              this._localTimelineStyles.has(a) ||
                this._backFill.set(a, this._globalTimelineStyles.get(a) ?? sr),
              this._updateStyle(a, c);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((t, e) => {
              this._currentKeyframe.set(e, t);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((t, e) => {
              this._currentKeyframe.has(e) || this._currentKeyframe.set(e, t);
            }));
        }
        snapshotCurrentStyles() {
          for (let [t, e] of this._localTimelineStyles)
            this._pendingStyles.set(t, e), this._updateStyle(t, e);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const t = [];
          for (let e in this._currentKeyframe) t.push(e);
          return t;
        }
        mergeTimelineCollectedStyles(t) {
          t._styleSummary.forEach((e, r) => {
            const i = this._styleSummary.get(r);
            (!i || e.time > i.time) && this._updateStyle(r, e.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const t = new Set(),
            e = new Set(),
            r = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const c = kr(a, new Map(), this._backFill);
            c.forEach((u, d) => {
              "!" === u ? t.add(d) : u === sr && e.add(d);
            }),
              r || c.set("offset", l / this.duration),
              i.push(c);
          });
          const s = t.size ? _u(t.values()) : [],
            o = e.size ? _u(e.values()) : [];
          if (r) {
            const a = i[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
          }
          return Qg(
            this.element,
            i,
            s,
            o,
            this.duration,
            this.startTime,
            this.easing,
            !1,
          );
        }
      }
      class q3 extends Su {
        constructor(t, e, r, i, s, o, a = !1) {
          super(t, e, o.delay),
            (this.keyframes = r),
            (this.preStyleProps = i),
            (this.postStyleProps = s),
            (this._stretchStartingKeyframe = a),
            (this.timings = {
              duration: o.duration,
              delay: o.delay,
              easing: o.easing,
            });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let t = this.keyframes,
            { delay: e, duration: r, easing: i } = this.timings;
          if (this._stretchStartingKeyframe && e) {
            const s = [],
              o = r + e,
              a = e / o,
              l = kr(t[0]);
            l.set("offset", 0), s.push(l);
            const c = kr(t[0]);
            c.set("offset", V0(a)), s.push(c);
            const u = t.length - 1;
            for (let d = 1; d <= u; d++) {
              let h = kr(t[d]);
              const f = h.get("offset");
              h.set("offset", V0((e + f * r) / o)), s.push(h);
            }
            (r = o), (e = 0), (i = ""), (t = s);
          }
          return Qg(
            this.element,
            t,
            this.preStyleProps,
            this.postStyleProps,
            r,
            e,
            i,
            !0,
          );
        }
      }
      function V0(n, t = 3) {
        const e = Math.pow(10, t - 1);
        return Math.round(n * e) / e;
      }
      class em {}
      const Y3 = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class Z3 extends em {
        normalizePropertyName(t, e) {
          return Kg(t);
        }
        normalizeStyleValue(t, e, r, i) {
          let s = "";
          const o = r.toString().trim();
          if (Y3.has(e) && 0 !== r && "0" !== r)
            if ("number" == typeof r) s = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                i.push(
                  (function Bz(n, t) {
                    return new C(3005, !1);
                  })(),
                );
            }
          return o + s;
        }
      }
      function B0(n, t, e, r, i, s, o, a, l, c, u, d, h) {
        return {
          type: 0,
          element: n,
          triggerName: t,
          isRemovalTransition: i,
          fromState: e,
          fromStyles: s,
          toState: r,
          toStyles: o,
          timelines: a,
          queriedElements: l,
          preStyleProps: c,
          postStyleProps: u,
          totalTime: d,
          errors: h,
        };
      }
      const tm = {};
      class j0 {
        constructor(t, e, r) {
          (this._triggerName = t), (this.ast = e), (this._stateStyles = r);
        }
        match(t, e, r, i) {
          return (function Q3(n, t, e, r, i) {
            return n.some((s) => s(t, e, r, i));
          })(this.ast.matchers, t, e, r, i);
        }
        buildStyles(t, e, r) {
          let i = this._stateStyles.get("*");
          return (
            void 0 !== t && (i = this._stateStyles.get(t?.toString()) || i),
            i ? i.buildStyles(e, r) : new Map()
          );
        }
        build(t, e, r, i, s, o, a, l, c, u) {
          const d = [],
            h = (this.ast.options && this.ast.options.params) || tm,
            p = this.buildStyles(r, (a && a.params) || tm, d),
            g = (l && l.params) || tm,
            y = this.buildStyles(i, g, d),
            b = new Set(),
            M = new Map(),
            v = new Map(),
            T = "void" === i,
            Q = { params: X3(g, h), delay: this.ast.options?.delay },
            ie = u ? [] : Xg(t, e, this.ast.animation, s, o, p, y, Q, c, d);
          let Oe = 0;
          if (
            (ie.forEach((Wt) => {
              Oe = Math.max(Wt.duration + Wt.delay, Oe);
            }),
            d.length)
          )
            return B0(e, this._triggerName, r, i, T, p, y, [], [], M, v, Oe, d);
          ie.forEach((Wt) => {
            const qt = Wt.element,
              Ts = $t(M, qt, new Set());
            Wt.preStyleProps.forEach((wn) => Ts.add(wn));
            const cr = $t(v, qt, new Set());
            Wt.postStyleProps.forEach((wn) => cr.add(wn)),
              qt !== e && b.add(qt);
          });
          const Gt = _u(b.values());
          return B0(e, this._triggerName, r, i, T, p, y, ie, Gt, M, v, Oe);
        }
      }
      function X3(n, t) {
        const e = Ca(t);
        for (const r in n) n.hasOwnProperty(r) && null != n[r] && (e[r] = n[r]);
        return e;
      }
      class J3 {
        constructor(t, e, r) {
          (this.styles = t), (this.defaultParams = e), (this.normalizer = r);
        }
        buildStyles(t, e) {
          const r = new Map(),
            i = Ca(this.defaultParams);
          return (
            Object.keys(t).forEach((s) => {
              const o = t[s];
              null !== o && (i[s] = o);
            }),
            this.styles.styles.forEach((s) => {
              "string" != typeof s &&
                s.forEach((o, a) => {
                  o && (o = wa(o, i, e));
                  const l = this.normalizer.normalizePropertyName(a, e);
                  (o = this.normalizer.normalizeStyleValue(a, l, o, e)),
                    r.set(l, o);
                });
            }),
            r
          );
        }
      }
      class t4 {
        constructor(t, e, r) {
          (this.name = t),
            (this.ast = e),
            (this._normalizer = r),
            (this.transitionFactories = []),
            (this.states = new Map()),
            e.states.forEach((i) => {
              this.states.set(
                i.name,
                new J3(i.style, (i.options && i.options.params) || {}, r),
              );
            }),
            U0(this.states, "true", "1"),
            U0(this.states, "false", "0"),
            e.transitions.forEach((i) => {
              this.transitionFactories.push(new j0(t, i, this.states));
            }),
            (this.fallbackTransition = (function n4(n, t, e) {
              return new j0(
                n,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(o, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                t,
              );
            })(t, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(t, e, r, i) {
          return (
            this.transitionFactories.find((o) => o.match(t, e, r, i)) || null
          );
        }
        matchStyles(t, e, r) {
          return this.fallbackTransition.buildStyles(t, e, r);
        }
      }
      function U0(n, t, e) {
        n.has(t)
          ? n.has(e) || n.set(e, n.get(t))
          : n.has(e) && n.set(t, n.get(e));
      }
      const r4 = new wu();
      class i4 {
        constructor(t, e, r) {
          (this.bodyNode = t),
            (this._driver = e),
            (this._normalizer = r),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(t, e) {
          const r = [],
            s = Yg(this._driver, e, r, []);
          if (r.length)
            throw (function r3(n) {
              return new C(3503, !1);
            })();
          this._animations.set(t, s);
        }
        _buildPlayer(t, e, r) {
          const i = t.element,
            s = v0(0, this._normalizer, 0, t.keyframes, e, r);
          return this._driver.animate(
            i,
            s,
            t.duration,
            t.delay,
            t.easing,
            [],
            !0,
          );
        }
        create(t, e, r = {}) {
          const i = [],
            s = this._animations.get(t);
          let o;
          const a = new Map();
          if (
            (s
              ? ((o = Xg(
                  this._driver,
                  e,
                  s,
                  zg,
                  fu,
                  new Map(),
                  new Map(),
                  r,
                  r4,
                  i,
                )),
                o.forEach((u) => {
                  const d = $t(a, u.element, new Map());
                  u.postStyleProps.forEach((h) => d.set(h, null));
                }))
              : (i.push(
                  (function s3() {
                    return new C(3300, !1);
                  })(),
                ),
                (o = [])),
            i.length)
          )
            throw (function o3(n) {
              return new C(3504, !1);
            })();
          a.forEach((u, d) => {
            u.forEach((h, f) => {
              u.set(f, this._driver.computeStyle(d, f, sr));
            });
          });
          const c = Or(
            o.map((u) => {
              const d = a.get(u.element);
              return this._buildPlayer(u, new Map(), d);
            }),
          );
          return (
            this._playersById.set(t, c),
            c.onDestroy(() => this.destroy(t)),
            this.players.push(c),
            c
          );
        }
        destroy(t) {
          const e = this._getPlayer(t);
          e.destroy(), this._playersById.delete(t);
          const r = this.players.indexOf(e);
          r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(t) {
          const e = this._playersById.get(t);
          if (!e)
            throw (function a3(n) {
              return new C(3301, !1);
            })();
          return e;
        }
        listen(t, e, r, i) {
          const s = jg(e, "", "", "");
          return Vg(this._getPlayer(t), r, s, i), () => {};
        }
        command(t, e, r, i) {
          if ("register" == r) return void this.register(t, i[0]);
          if ("create" == r) return void this.create(t, e, i[0] || {});
          const s = this._getPlayer(t);
          switch (r) {
            case "play":
              s.play();
              break;
            case "pause":
              s.pause();
              break;
            case "reset":
              s.reset();
              break;
            case "restart":
              s.restart();
              break;
            case "finish":
              s.finish();
              break;
            case "init":
              s.init();
              break;
            case "setPosition":
              s.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(t);
          }
        }
      }
      const H0 = "ng-animate-queued",
        nm = "ng-animate-disabled",
        c4 = [],
        $0 = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        u4 = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        },
        sn = "__ng_removed";
      class rm {
        constructor(t, e = "") {
          this.namespaceId = e;
          const r = t && t.hasOwnProperty("value");
          if (
            ((this.value = (function p4(n) {
              return n ?? null;
            })(r ? t.value : t)),
            r)
          ) {
            const s = Ca(t);
            delete s.value, (this.options = s);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        get params() {
          return this.options.params;
        }
        absorbOptions(t) {
          const e = t.params;
          if (e) {
            const r = this.options.params;
            Object.keys(e).forEach((i) => {
              null == r[i] && (r[i] = e[i]);
            });
          }
        }
      }
      const Ea = "void",
        im = new rm(Ea);
      class d4 {
        constructor(t, e, r) {
          (this.id = t),
            (this.hostElement = e),
            (this._engine = r),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + t),
            on(e, this._hostClassName);
        }
        listen(t, e, r, i) {
          if (!this._triggers.has(e))
            throw (function l3(n, t) {
              return new C(3302, !1);
            })();
          if (null == r || 0 == r.length)
            throw (function c3(n) {
              return new C(3303, !1);
            })();
          if (
            !(function g4(n) {
              return "start" == n || "done" == n;
            })(r)
          )
            throw (function u3(n, t) {
              return new C(3400, !1);
            })();
          const s = $t(this._elementListeners, t, []),
            o = { name: e, phase: r, callback: i };
          s.push(o);
          const a = $t(this._engine.statesByElement, t, new Map());
          return (
            a.has(e) || (on(t, pu), on(t, pu + "-" + e), a.set(e, im)),
            () => {
              this._engine.afterFlush(() => {
                const l = s.indexOf(o);
                l >= 0 && s.splice(l, 1), this._triggers.has(e) || a.delete(e);
              });
            }
          );
        }
        register(t, e) {
          return !this._triggers.has(t) && (this._triggers.set(t, e), !0);
        }
        _getTrigger(t) {
          const e = this._triggers.get(t);
          if (!e)
            throw (function d3(n) {
              return new C(3401, !1);
            })();
          return e;
        }
        trigger(t, e, r, i = !0) {
          const s = this._getTrigger(e),
            o = new sm(this.id, e, t);
          let a = this._engine.statesByElement.get(t);
          a ||
            (on(t, pu),
            on(t, pu + "-" + e),
            this._engine.statesByElement.set(t, (a = new Map())));
          let l = a.get(e);
          const c = new rm(r, this.id);
          if (
            (!(r && r.hasOwnProperty("value")) &&
              l &&
              c.absorbOptions(l.options),
            a.set(e, c),
            l || (l = im),
            c.value !== Ea && l.value === c.value)
          ) {
            if (
              !(function y4(n, t) {
                const e = Object.keys(n),
                  r = Object.keys(t);
                if (e.length != r.length) return !1;
                for (let i = 0; i < e.length; i++) {
                  const s = e[i];
                  if (!t.hasOwnProperty(s) || n[s] !== t[s]) return !1;
                }
                return !0;
              })(l.params, c.params)
            ) {
              const g = [],
                y = s.matchStyles(l.value, l.params, g),
                b = s.matchStyles(c.value, c.params, g);
              g.length
                ? this._engine.reportError(g)
                : this._engine.afterFlush(() => {
                    fi(t, y), Bn(t, b);
                  });
            }
            return;
          }
          const h = $t(this._engine.playersByElement, t, []);
          h.forEach((g) => {
            g.namespaceId == this.id &&
              g.triggerName == e &&
              g.queued &&
              g.destroy();
          });
          let f = s.matchTransition(l.value, c.value, t, c.params),
            p = !1;
          if (!f) {
            if (!i) return;
            (f = s.fallbackTransition), (p = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: t,
              triggerName: e,
              transition: f,
              fromState: l,
              toState: c,
              player: o,
              isFallbackTransition: p,
            }),
            p ||
              (on(t, H0),
              o.onStart(() => {
                As(t, H0);
              })),
            o.onDone(() => {
              let g = this.players.indexOf(o);
              g >= 0 && this.players.splice(g, 1);
              const y = this._engine.playersByElement.get(t);
              if (y) {
                let b = y.indexOf(o);
                b >= 0 && y.splice(b, 1);
              }
            }),
            this.players.push(o),
            h.push(o),
            o
          );
        }
        deregister(t) {
          this._triggers.delete(t),
            this._engine.statesByElement.forEach((e) => e.delete(t)),
            this._elementListeners.forEach((e, r) => {
              this._elementListeners.set(
                r,
                e.filter((i) => i.name != t),
              );
            });
        }
        clearElementCache(t) {
          this._engine.statesByElement.delete(t),
            this._elementListeners.delete(t);
          const e = this._engine.playersByElement.get(t);
          e &&
            (e.forEach((r) => r.destroy()),
            this._engine.playersByElement.delete(t));
        }
        _signalRemovalForInnerTriggers(t, e) {
          const r = this._engine.driver.query(t, gu, !0);
          r.forEach((i) => {
            if (i[sn]) return;
            const s = this._engine.fetchNamespacesByElement(i);
            s.size
              ? s.forEach((o) => o.triggerLeaveAnimation(i, e, !1, !0))
              : this.clearElementCache(i);
          }),
            this._engine.afterFlushAnimationsDone(() =>
              r.forEach((i) => this.clearElementCache(i)),
            );
        }
        triggerLeaveAnimation(t, e, r, i) {
          const s = this._engine.statesByElement.get(t),
            o = new Map();
          if (s) {
            const a = [];
            if (
              (s.forEach((l, c) => {
                if ((o.set(c, l.value), this._triggers.has(c))) {
                  const u = this.trigger(t, c, Ea, i);
                  u && a.push(u);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, t, !0, e, o),
                r && Or(a).onDone(() => this._engine.processLeaveNode(t)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(t) {
          const e = this._elementListeners.get(t),
            r = this._engine.statesByElement.get(t);
          if (e && r) {
            const i = new Set();
            e.forEach((s) => {
              const o = s.name;
              if (i.has(o)) return;
              i.add(o);
              const l = this._triggers.get(o).fallbackTransition,
                c = r.get(o) || im,
                u = new rm(Ea),
                d = new sm(this.id, o, t);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: t,
                  triggerName: o,
                  transition: l,
                  fromState: c,
                  toState: u,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(t, e) {
          const r = this._engine;
          if (
            (t.childElementCount && this._signalRemovalForInnerTriggers(t, e),
            this.triggerLeaveAnimation(t, e, !0))
          )
            return;
          let i = !1;
          if (r.totalAnimations) {
            const s = r.players.length ? r.playersByQueriedElement.get(t) : [];
            if (s && s.length) i = !0;
            else {
              let o = t;
              for (; (o = o.parentNode); )
                if (r.statesByElement.get(o)) {
                  i = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(t), i))
            r.markElementAsRemoved(this.id, t, !1, e);
          else {
            const s = t[sn];
            (!s || s === $0) &&
              (r.afterFlush(() => this.clearElementCache(t)),
              r.destroyInnerAnimations(t),
              r._onRemovalComplete(t, e));
          }
        }
        insertNode(t, e) {
          on(t, this._hostClassName);
        }
        drainQueuedTransitions(t) {
          const e = [];
          return (
            this._queue.forEach((r) => {
              const i = r.player;
              if (i.destroyed) return;
              const s = r.element,
                o = this._elementListeners.get(s);
              o &&
                o.forEach((a) => {
                  if (a.name == r.triggerName) {
                    const l = jg(
                      s,
                      r.triggerName,
                      r.fromState.value,
                      r.toState.value,
                    );
                    (l._data = t), Vg(r.player, a.phase, l, a.callback);
                  }
                }),
                i.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      i.destroy();
                    })
                  : e.push(r);
            }),
            (this._queue = []),
            e.sort((r, i) => {
              const s = r.transition.ast.depCount,
                o = i.transition.ast.depCount;
              return 0 == s || 0 == o
                ? s - o
                : this._engine.driver.containsElement(r.element, i.element)
                  ? 1
                  : -1;
            })
          );
        }
        destroy(t) {
          this.players.forEach((e) => e.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, t);
        }
        elementContainsData(t) {
          let e = !1;
          return (
            this._elementListeners.has(t) && (e = !0),
            (e = !!this._queue.find((r) => r.element === t) || e),
            e
          );
        }
      }
      class h4 {
        constructor(t, e, r) {
          (this.bodyNode = t),
            (this.driver = e),
            (this._normalizer = r),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (i, s) => {});
        }
        _onRemovalComplete(t, e) {
          this.onRemovalComplete(t, e);
        }
        get queuedPlayers() {
          const t = [];
          return (
            this._namespaceList.forEach((e) => {
              e.players.forEach((r) => {
                r.queued && t.push(r);
              });
            }),
            t
          );
        }
        createNamespace(t, e) {
          const r = new d4(t, e, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, e)
              ? this._balanceNamespaceList(r, e)
              : (this.newHostElements.set(e, r), this.collectEnterElement(e)),
            (this._namespaceLookup[t] = r)
          );
        }
        _balanceNamespaceList(t, e) {
          const r = this._namespaceList,
            i = this.namespacesByHostElement;
          if (r.length - 1 >= 0) {
            let o = !1,
              a = this.driver.getParentElement(e);
            for (; a; ) {
              const l = i.get(a);
              if (l) {
                const c = r.indexOf(l);
                r.splice(c + 1, 0, t), (o = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            o || r.unshift(t);
          } else r.push(t);
          return i.set(e, t), t;
        }
        register(t, e) {
          let r = this._namespaceLookup[t];
          return r || (r = this.createNamespace(t, e)), r;
        }
        registerTrigger(t, e, r) {
          let i = this._namespaceLookup[t];
          i && i.register(e, r) && this.totalAnimations++;
        }
        destroy(t, e) {
          if (!t) return;
          const r = this._fetchNamespace(t);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement),
              delete this._namespaceLookup[t];
            const i = this._namespaceList.indexOf(r);
            i >= 0 && this._namespaceList.splice(i, 1);
          }),
            this.afterFlushAnimationsDone(() => r.destroy(e));
        }
        _fetchNamespace(t) {
          return this._namespaceLookup[t];
        }
        fetchNamespacesByElement(t) {
          const e = new Set(),
            r = this.statesByElement.get(t);
          if (r)
            for (let i of r.values())
              if (i.namespaceId) {
                const s = this._fetchNamespace(i.namespaceId);
                s && e.add(s);
              }
          return e;
        }
        trigger(t, e, r, i) {
          if (Mu(e)) {
            const s = this._fetchNamespace(t);
            if (s) return s.trigger(e, r, i), !0;
          }
          return !1;
        }
        insertNode(t, e, r, i) {
          if (!Mu(e)) return;
          const s = e[sn];
          if (s && s.setForRemoval) {
            (s.setForRemoval = !1), (s.setForMove = !0);
            const o = this.collectedLeaveElements.indexOf(e);
            o >= 0 && this.collectedLeaveElements.splice(o, 1);
          }
          if (t) {
            const o = this._fetchNamespace(t);
            o && o.insertNode(e, r);
          }
          i && this.collectEnterElement(e);
        }
        collectEnterElement(t) {
          this.collectedEnterElements.push(t);
        }
        markElementAsDisabled(t, e) {
          e
            ? this.disabledNodes.has(t) ||
              (this.disabledNodes.add(t), on(t, nm))
            : this.disabledNodes.has(t) &&
              (this.disabledNodes.delete(t), As(t, nm));
        }
        removeNode(t, e, r, i) {
          if (Mu(e)) {
            const s = t ? this._fetchNamespace(t) : null;
            if (
              (s ? s.removeNode(e, i) : this.markElementAsRemoved(t, e, !1, i),
              r)
            ) {
              const o = this.namespacesByHostElement.get(e);
              o && o.id !== t && o.removeNode(e, i);
            }
          } else this._onRemovalComplete(e, i);
        }
        markElementAsRemoved(t, e, r, i, s) {
          this.collectedLeaveElements.push(e),
            (e[sn] = {
              namespaceId: t,
              setForRemoval: i,
              hasAnimation: r,
              removedBeforeQueried: !1,
              previousTriggersValues: s,
            });
        }
        listen(t, e, r, i, s) {
          return Mu(e) ? this._fetchNamespace(t).listen(e, r, i, s) : () => {};
        }
        _buildInstruction(t, e, r, i, s) {
          return t.transition.build(
            this.driver,
            t.element,
            t.fromState.value,
            t.toState.value,
            r,
            i,
            t.fromState.options,
            t.toState.options,
            e,
            s,
          );
        }
        destroyInnerAnimations(t) {
          let e = this.driver.query(t, gu, !0);
          e.forEach((r) => this.destroyActiveAnimationsForElement(r)),
            0 != this.playersByQueriedElement.size &&
              ((e = this.driver.query(t, Gg, !0)),
              e.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
        }
        destroyActiveAnimationsForElement(t) {
          const e = this.playersByElement.get(t);
          e &&
            e.forEach((r) => {
              r.queued ? (r.markedForDestroy = !0) : r.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(t) {
          const e = this.playersByQueriedElement.get(t);
          e && e.forEach((r) => r.finish());
        }
        whenRenderingDone() {
          return new Promise((t) => {
            if (this.players.length) return Or(this.players).onDone(() => t());
            t();
          });
        }
        processLeaveNode(t) {
          const e = t[sn];
          if (e && e.setForRemoval) {
            if (((t[sn] = $0), e.namespaceId)) {
              this.destroyInnerAnimations(t);
              const r = this._fetchNamespace(e.namespaceId);
              r && r.clearElementCache(t);
            }
            this._onRemovalComplete(t, e.setForRemoval);
          }
          t.classList?.contains(nm) && this.markElementAsDisabled(t, !1),
            this.driver.query(t, ".ng-animate-disabled", !0).forEach((r) => {
              this.markElementAsDisabled(r, !1);
            });
        }
        flush(t = -1) {
          let e = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((r, i) =>
                this._balanceNamespaceList(r, i),
              ),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let r = 0; r < this.collectedEnterElements.length; r++)
              on(this.collectedEnterElements[r], "ng-star-inserted");
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const r = [];
            try {
              e = this._flushAnimations(r, t);
            } finally {
              for (let i = 0; i < r.length; i++) r[i]();
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++)
              this.processLeaveNode(this.collectedLeaveElements[r]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach((r) => r()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const r = this._whenQuietFns;
            (this._whenQuietFns = []),
              e.length
                ? Or(e).onDone(() => {
                    r.forEach((i) => i());
                  })
                : r.forEach((i) => i());
          }
        }
        reportError(t) {
          throw (function h3(n) {
            return new C(3402, !1);
          })();
        }
        _flushAnimations(t, e) {
          const r = new wu(),
            i = [],
            s = new Map(),
            o = [],
            a = new Map(),
            l = new Map(),
            c = new Map(),
            u = new Set();
          this.disabledNodes.forEach((O) => {
            u.add(O);
            const N = this.driver.query(O, ".ng-animate-queued", !0);
            for (let j = 0; j < N.length; j++) u.add(N[j]);
          });
          const d = this.bodyNode,
            h = Array.from(this.statesByElement.keys()),
            f = W0(h, this.collectedEnterElements),
            p = new Map();
          let g = 0;
          f.forEach((O, N) => {
            const j = zg + g++;
            p.set(N, j), O.forEach((ce) => on(ce, j));
          });
          const y = [],
            b = new Set(),
            M = new Set();
          for (let O = 0; O < this.collectedLeaveElements.length; O++) {
            const N = this.collectedLeaveElements[O],
              j = N[sn];
            j &&
              j.setForRemoval &&
              (y.push(N),
              b.add(N),
              j.hasAnimation
                ? this.driver
                    .query(N, ".ng-star-inserted", !0)
                    .forEach((ce) => b.add(ce))
                : M.add(N));
          }
          const v = new Map(),
            T = W0(h, Array.from(b));
          T.forEach((O, N) => {
            const j = fu + g++;
            v.set(N, j), O.forEach((ce) => on(ce, j));
          }),
            t.push(() => {
              f.forEach((O, N) => {
                const j = p.get(N);
                O.forEach((ce) => As(ce, j));
              }),
                T.forEach((O, N) => {
                  const j = v.get(N);
                  O.forEach((ce) => As(ce, j));
                }),
                y.forEach((O) => {
                  this.processLeaveNode(O);
                });
            });
          const Q = [],
            ie = [];
          for (let O = this._namespaceList.length - 1; O >= 0; O--)
            this._namespaceList[O].drainQueuedTransitions(e).forEach((j) => {
              const ce = j.player,
                Je = j.element;
              if ((Q.push(ce), this.collectedEnterElements.length)) {
                const ht = Je[sn];
                if (ht && ht.setForMove) {
                  if (
                    ht.previousTriggersValues &&
                    ht.previousTriggersValues.has(j.triggerName)
                  ) {
                    const gi = ht.previousTriggersValues.get(j.triggerName),
                      an = this.statesByElement.get(j.element);
                    if (an && an.has(j.triggerName)) {
                      const Iu = an.get(j.triggerName);
                      (Iu.value = gi), an.set(j.triggerName, Iu);
                    }
                  }
                  return void ce.destroy();
                }
              }
              const jn = !d || !this.driver.containsElement(d, Je),
                Kt = v.get(Je),
                Fr = p.get(Je),
                ke = this._buildInstruction(j, r, Fr, Kt, jn);
              if (ke.errors && ke.errors.length) return void ie.push(ke);
              if (jn)
                return (
                  ce.onStart(() => fi(Je, ke.fromStyles)),
                  ce.onDestroy(() => Bn(Je, ke.toStyles)),
                  void i.push(ce)
                );
              if (j.isFallbackTransition)
                return (
                  ce.onStart(() => fi(Je, ke.fromStyles)),
                  ce.onDestroy(() => Bn(Je, ke.toStyles)),
                  void i.push(ce)
                );
              const tA = [];
              ke.timelines.forEach((ht) => {
                (ht.stretchStartingKeyframe = !0),
                  this.disabledNodes.has(ht.element) || tA.push(ht);
              }),
                (ke.timelines = tA),
                r.append(Je, ke.timelines),
                o.push({ instruction: ke, player: ce, element: Je }),
                ke.queriedElements.forEach((ht) => $t(a, ht, []).push(ce)),
                ke.preStyleProps.forEach((ht, gi) => {
                  if (ht.size) {
                    let an = l.get(gi);
                    an || l.set(gi, (an = new Set())),
                      ht.forEach((Iu, lm) => an.add(lm));
                  }
                }),
                ke.postStyleProps.forEach((ht, gi) => {
                  let an = c.get(gi);
                  an || c.set(gi, (an = new Set())),
                    ht.forEach((Iu, lm) => an.add(lm));
                });
            });
          if (ie.length) {
            const O = [];
            ie.forEach((N) => {
              O.push(
                (function f3(n, t) {
                  return new C(3505, !1);
                })(),
              );
            }),
              Q.forEach((N) => N.destroy()),
              this.reportError(O);
          }
          const Oe = new Map(),
            Gt = new Map();
          o.forEach((O) => {
            const N = O.element;
            r.has(N) &&
              (Gt.set(N, N),
              this._beforeAnimationBuild(
                O.player.namespaceId,
                O.instruction,
                Oe,
              ));
          }),
            i.forEach((O) => {
              const N = O.element;
              this._getPreviousPlayers(
                N,
                !1,
                O.namespaceId,
                O.triggerName,
                null,
              ).forEach((ce) => {
                $t(Oe, N, []).push(ce), ce.destroy();
              });
            });
          const Wt = y.filter((O) => K0(O, l, c)),
            qt = new Map();
          G0(qt, this.driver, M, c, sr).forEach((O) => {
            K0(O, l, c) && Wt.push(O);
          });
          const cr = new Map();
          f.forEach((O, N) => {
            G0(cr, this.driver, new Set(O), l, "!");
          }),
            Wt.forEach((O) => {
              const N = qt.get(O),
                j = cr.get(O);
              qt.set(
                O,
                new Map([
                  ...Array.from(N?.entries() ?? []),
                  ...Array.from(j?.entries() ?? []),
                ]),
              );
            });
          const wn = [],
            Is = [],
            Rs = {};
          o.forEach((O) => {
            const { element: N, player: j, instruction: ce } = O;
            if (r.has(N)) {
              if (u.has(N))
                return (
                  j.onDestroy(() => Bn(N, ce.toStyles)),
                  (j.disabled = !0),
                  j.overrideTotalTime(ce.totalTime),
                  void i.push(j)
                );
              let Je = Rs;
              if (Gt.size > 1) {
                let Kt = N;
                const Fr = [];
                for (; (Kt = Kt.parentNode); ) {
                  const ke = Gt.get(Kt);
                  if (ke) {
                    Je = ke;
                    break;
                  }
                  Fr.push(Kt);
                }
                Fr.forEach((ke) => Gt.set(ke, Je));
              }
              const jn = this._buildAnimation(j.namespaceId, ce, Oe, s, cr, qt);
              if ((j.setRealPlayer(jn), Je === Rs)) wn.push(j);
              else {
                const Kt = this.playersByElement.get(Je);
                Kt && Kt.length && (j.parentPlayer = Or(Kt)), i.push(j);
              }
            } else
              fi(N, ce.fromStyles),
                j.onDestroy(() => Bn(N, ce.toStyles)),
                Is.push(j),
                u.has(N) && i.push(j);
          }),
            Is.forEach((O) => {
              const N = s.get(O.element);
              if (N && N.length) {
                const j = Or(N);
                O.setRealPlayer(j);
              }
            }),
            i.forEach((O) => {
              O.parentPlayer ? O.syncPlayerEvents(O.parentPlayer) : O.destroy();
            });
          for (let O = 0; O < y.length; O++) {
            const N = y[O],
              j = N[sn];
            if ((As(N, fu), j && j.hasAnimation)) continue;
            let ce = [];
            if (a.size) {
              let jn = a.get(N);
              jn && jn.length && ce.push(...jn);
              let Kt = this.driver.query(N, Gg, !0);
              for (let Fr = 0; Fr < Kt.length; Fr++) {
                let ke = a.get(Kt[Fr]);
                ke && ke.length && ce.push(...ke);
              }
            }
            const Je = ce.filter((jn) => !jn.destroyed);
            Je.length ? m4(this, N, Je) : this.processLeaveNode(N);
          }
          return (
            (y.length = 0),
            wn.forEach((O) => {
              this.players.push(O),
                O.onDone(() => {
                  O.destroy();
                  const N = this.players.indexOf(O);
                  this.players.splice(N, 1);
                }),
                O.play();
            }),
            wn
          );
        }
        elementContainsData(t, e) {
          let r = !1;
          const i = e[sn];
          return (
            i && i.setForRemoval && (r = !0),
            this.playersByElement.has(e) && (r = !0),
            this.playersByQueriedElement.has(e) && (r = !0),
            this.statesByElement.has(e) && (r = !0),
            this._fetchNamespace(t).elementContainsData(e) || r
          );
        }
        afterFlush(t) {
          this._flushFns.push(t);
        }
        afterFlushAnimationsDone(t) {
          this._whenQuietFns.push(t);
        }
        _getPreviousPlayers(t, e, r, i, s) {
          let o = [];
          if (e) {
            const a = this.playersByQueriedElement.get(t);
            a && (o = a);
          } else {
            const a = this.playersByElement.get(t);
            if (a) {
              const l = !s || s == Ea;
              a.forEach((c) => {
                c.queued || (!l && c.triggerName != i) || o.push(c);
              });
            }
          }
          return (
            (r || i) &&
              (o = o.filter(
                (a) =>
                  !((r && r != a.namespaceId) || (i && i != a.triggerName)),
              )),
            o
          );
        }
        _beforeAnimationBuild(t, e, r) {
          const s = e.element,
            o = e.isRemovalTransition ? void 0 : t,
            a = e.isRemovalTransition ? void 0 : e.triggerName;
          for (const l of e.timelines) {
            const c = l.element,
              u = c !== s,
              d = $t(r, c, []);
            this._getPreviousPlayers(c, u, o, a, e.toState).forEach((f) => {
              const p = f.getRealPlayer();
              p.beforeDestroy && p.beforeDestroy(), f.destroy(), d.push(f);
            });
          }
          fi(s, e.fromStyles);
        }
        _buildAnimation(t, e, r, i, s, o) {
          const a = e.triggerName,
            l = e.element,
            c = [],
            u = new Set(),
            d = new Set(),
            h = e.timelines.map((p) => {
              const g = p.element;
              u.add(g);
              const y = g[sn];
              if (y && y.removedBeforeQueried)
                return new Jo(p.duration, p.delay);
              const b = g !== l,
                M = (function _4(n) {
                  const t = [];
                  return q0(n, t), t;
                })((r.get(g) || c4).map((Oe) => Oe.getRealPlayer())).filter(
                  (Oe) => !!Oe.element && Oe.element === g,
                ),
                v = s.get(g),
                T = o.get(g),
                Q = v0(0, this._normalizer, 0, p.keyframes, v, T),
                ie = this._buildPlayer(p, Q, M);
              if ((p.subTimeline && i && d.add(g), b)) {
                const Oe = new sm(t, a, g);
                Oe.setRealPlayer(ie), c.push(Oe);
              }
              return ie;
            });
          c.forEach((p) => {
            $t(this.playersByQueriedElement, p.element, []).push(p),
              p.onDone(() =>
                (function f4(n, t, e) {
                  let r = n.get(t);
                  if (r) {
                    if (r.length) {
                      const i = r.indexOf(e);
                      r.splice(i, 1);
                    }
                    0 == r.length && n.delete(t);
                  }
                  return r;
                })(this.playersByQueriedElement, p.element, p),
              );
          }),
            u.forEach((p) => on(p, T0));
          const f = Or(h);
          return (
            f.onDestroy(() => {
              u.forEach((p) => As(p, T0)), Bn(l, e.toStyles);
            }),
            d.forEach((p) => {
              $t(i, p, []).push(f);
            }),
            f
          );
        }
        _buildPlayer(t, e, r) {
          return e.length > 0
            ? this.driver.animate(
                t.element,
                e,
                t.duration,
                t.delay,
                t.easing,
                r,
              )
            : new Jo(t.duration, t.delay);
        }
      }
      class sm {
        constructor(t, e, r) {
          (this.namespaceId = t),
            (this.triggerName = e),
            (this.element = r),
            (this._player = new Jo()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(t) {
          this._containsRealPlayer ||
            ((this._player = t),
            this._queuedCallbacks.forEach((e, r) => {
              e.forEach((i) => Vg(t, r, void 0, i));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(t.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(t) {
          this.totalTime = t;
        }
        syncPlayerEvents(t) {
          const e = this._player;
          e.triggerCallback && t.onStart(() => e.triggerCallback("start")),
            t.onDone(() => this.finish()),
            t.onDestroy(() => this.destroy());
        }
        _queueEvent(t, e) {
          $t(this._queuedCallbacks, t, []).push(e);
        }
        onDone(t) {
          this.queued && this._queueEvent("done", t), this._player.onDone(t);
        }
        onStart(t) {
          this.queued && this._queueEvent("start", t), this._player.onStart(t);
        }
        onDestroy(t) {
          this.queued && this._queueEvent("destroy", t),
            this._player.onDestroy(t);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(t) {
          this.queued || this._player.setPosition(t);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(t) {
          const e = this._player;
          e.triggerCallback && e.triggerCallback(t);
        }
      }
      function Mu(n) {
        return n && 1 === n.nodeType;
      }
      function z0(n, t) {
        const e = n.style.display;
        return (n.style.display = t ?? "none"), e;
      }
      function G0(n, t, e, r, i) {
        const s = [];
        e.forEach((l) => s.push(z0(l)));
        const o = [];
        r.forEach((l, c) => {
          const u = new Map();
          l.forEach((d) => {
            const h = t.computeStyle(c, d, i);
            u.set(d, h), (!h || 0 == h.length) && ((c[sn] = u4), o.push(c));
          }),
            n.set(c, u);
        });
        let a = 0;
        return e.forEach((l) => z0(l, s[a++])), o;
      }
      function W0(n, t) {
        const e = new Map();
        if ((n.forEach((a) => e.set(a, [])), 0 == t.length)) return e;
        const i = new Set(t),
          s = new Map();
        function o(a) {
          if (!a) return 1;
          let l = s.get(a);
          if (l) return l;
          const c = a.parentNode;
          return (l = e.has(c) ? c : i.has(c) ? 1 : o(c)), s.set(a, l), l;
        }
        return (
          t.forEach((a) => {
            const l = o(a);
            1 !== l && e.get(l).push(a);
          }),
          e
        );
      }
      function on(n, t) {
        n.classList?.add(t);
      }
      function As(n, t) {
        n.classList?.remove(t);
      }
      function m4(n, t, e) {
        Or(e).onDone(() => n.processLeaveNode(t));
      }
      function q0(n, t) {
        for (let e = 0; e < n.length; e++) {
          const r = n[e];
          r instanceof cS ? q0(r.players, t) : t.push(r);
        }
      }
      function K0(n, t, e) {
        const r = e.get(n);
        if (!r) return !1;
        let i = t.get(n);
        return i ? r.forEach((s) => i.add(s)) : t.set(n, r), e.delete(n), !0;
      }
      class Au {
        constructor(t, e, r) {
          (this.bodyNode = t),
            (this._driver = e),
            (this._normalizer = r),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (i, s) => {}),
            (this._transitionEngine = new h4(t, e, r)),
            (this._timelineEngine = new i4(t, e, r)),
            (this._transitionEngine.onRemovalComplete = (i, s) =>
              this.onRemovalComplete(i, s));
        }
        registerTrigger(t, e, r, i, s) {
          const o = t + "-" + i;
          let a = this._triggerCache[o];
          if (!a) {
            const l = [],
              u = Yg(this._driver, s, l, []);
            if (l.length)
              throw (function t3(n, t) {
                return new C(3404, !1);
              })();
            (a = (function e4(n, t, e) {
              return new t4(n, t, e);
            })(i, u, this._normalizer)),
              (this._triggerCache[o] = a);
          }
          this._transitionEngine.registerTrigger(e, i, a);
        }
        register(t, e) {
          this._transitionEngine.register(t, e);
        }
        destroy(t, e) {
          this._transitionEngine.destroy(t, e);
        }
        onInsert(t, e, r, i) {
          this._transitionEngine.insertNode(t, e, r, i);
        }
        onRemove(t, e, r, i) {
          this._transitionEngine.removeNode(t, e, i || !1, r);
        }
        disableAnimations(t, e) {
          this._transitionEngine.markElementAsDisabled(t, e);
        }
        process(t, e, r, i) {
          if ("@" == r.charAt(0)) {
            const [s, o] = b0(r);
            this._timelineEngine.command(s, e, o, i);
          } else this._transitionEngine.trigger(t, e, r, i);
        }
        listen(t, e, r, i, s) {
          if ("@" == r.charAt(0)) {
            const [o, a] = b0(r);
            return this._timelineEngine.listen(o, e, a, s);
          }
          return this._transitionEngine.listen(t, e, r, i, s);
        }
        flush(t = -1) {
          this._transitionEngine.flush(t);
        }
        get players() {
          return this._transitionEngine.players.concat(
            this._timelineEngine.players,
          );
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      let b4 = (() => {
        class n {
          constructor(e, r, i) {
            (this._element = e),
              (this._startStyles = r),
              (this._endStyles = i),
              (this._state = 0);
            let s = n.initialStylesByElement.get(e);
            s || n.initialStylesByElement.set(e, (s = new Map())),
              (this._initialStyles = s);
          }
          start() {
            this._state < 1 &&
              (this._startStyles &&
                Bn(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (Bn(this._element, this._initialStyles),
                this._endStyles &&
                  (Bn(this._element, this._endStyles),
                  (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (n.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (fi(this._element, this._startStyles),
                  (this._endStyles = null)),
                this._endStyles &&
                  (fi(this._element, this._endStyles),
                  (this._endStyles = null)),
                Bn(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (n.initialStylesByElement = new WeakMap()), n;
      })();
      function om(n) {
        let t = null;
        return (
          n.forEach((e, r) => {
            (function C4(n) {
              return "display" === n || "position" === n;
            })(r) && ((t = t || new Map()), t.set(r, e));
          }),
          t
        );
      }
      class Y0 {
        constructor(t, e, r, i) {
          (this.element = t),
            (this.keyframes = e),
            (this.options = r),
            (this._specialStyles = i),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = r.duration),
            (this._delay = r.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const t = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(
            this.element,
            t,
            this.options,
          )),
            (this._finalKeyframe = t.length ? t[t.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(t) {
          const e = [];
          return (
            t.forEach((r) => {
              e.push(Object.fromEntries(r));
            }),
            e
          );
        }
        _triggerWebAnimation(t, e, r) {
          return t.animate(this._convertKeyframesToObject(e), r);
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach((t) => t()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        setPosition(t) {
          void 0 === this.domPlayer && this.init(),
            (this.domPlayer.currentTime = t * this.time);
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const t = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((r, i) => {
              "offset" !== i &&
                t.set(i, this._finished ? r : F0(this.element, i));
            }),
            (this.currentSnapshot = t);
        }
        triggerCallback(t) {
          const e = "start" === t ? this._onStartFns : this._onDoneFns;
          e.forEach((r) => r()), (e.length = 0);
        }
      }
      class D4 {
        validateStyleProperty(t) {
          return !0;
        }
        validateAnimatableStyleProperty(t) {
          return !0;
        }
        matchesElement(t, e) {
          return !1;
        }
        containsElement(t, e) {
          return E0(t, e);
        }
        getParentElement(t) {
          return Hg(t);
        }
        query(t, e, r) {
          return S0(t, e, r);
        }
        computeStyle(t, e, r) {
          return window.getComputedStyle(t)[e];
        }
        animate(t, e, r, i, s, o = []) {
          const l = {
            duration: r,
            delay: i,
            fill: 0 == i ? "both" : "forwards",
          };
          s && (l.easing = s);
          const c = new Map(),
            u = o.filter((f) => f instanceof Y0);
          (function M3(n, t) {
            return 0 === n || 0 === t;
          })(r, i) &&
            u.forEach((f) => {
              f.currentSnapshot.forEach((p, g) => c.set(g, p));
            });
          let d = (function D3(n) {
            return n.length
              ? n[0] instanceof Map
                ? n
                : n.map((t) => I0(t))
              : [];
          })(e).map((f) => kr(f));
          d = (function A3(n, t, e) {
            if (e.size && t.length) {
              let r = t[0],
                i = [];
              if (
                (e.forEach((s, o) => {
                  r.has(o) || i.push(o), r.set(o, s);
                }),
                i.length)
              )
                for (let s = 1; s < t.length; s++) {
                  let o = t[s];
                  i.forEach((a) => o.set(a, F0(n, a)));
                }
            }
            return t;
          })(t, d, c);
          const h = (function v4(n, t) {
            let e = null,
              r = null;
            return (
              Array.isArray(t) && t.length
                ? ((e = om(t[0])), t.length > 1 && (r = om(t[t.length - 1])))
                : t instanceof Map && (e = om(t)),
              e || r ? new b4(n, e, r) : null
            );
          })(t, d);
          return new Y0(t, d, l, h);
        }
      }
      let w4 = (() => {
        class n extends oS {
          constructor(e, r) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = e.createRenderer(r.body, {
                id: "0",
                encapsulation: cn.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(e) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const i = Array.isArray(e) ? aS(e) : e;
            return (
              Z0(this._renderer, null, r, "register", [i]),
              new E4(r, this._renderer)
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(lo), m(Y));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class E4 extends class M2 {} {
        constructor(t, e) {
          super(), (this._id = t), (this._renderer = e);
        }
        create(t, e) {
          return new S4(this._id, t, e || {}, this._renderer);
        }
      }
      class S4 {
        constructor(t, e, r, i) {
          (this.id = t),
            (this.element = e),
            (this._renderer = i),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", r);
        }
        _listen(t, e) {
          return this._renderer.listen(this.element, `@@${this.id}:${t}`, e);
        }
        _command(t, ...e) {
          return Z0(this._renderer, this.element, this.id, t, e);
        }
        onDone(t) {
          this._listen("done", t);
        }
        onStart(t) {
          this._listen("start", t);
        }
        onDestroy(t) {
          this._listen("destroy", t);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(t) {
          this._command("setPosition", t);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function Z0(n, t, e, r, i) {
        return n.setProperty(t, `@@${e}:${r}`, i);
      }
      const Q0 = "@.disabled";
      let M4 = (() => {
        class n {
          constructor(e, r, i) {
            (this.delegate = e),
              (this.engine = r),
              (this._zone = i),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (r.onRemovalComplete = (s, o) => {
                const a = o?.parentNode(s);
                a && o.removeChild(a, s);
              });
          }
          createRenderer(e, r) {
            const s = this.delegate.createRenderer(e, r);
            if (!(e && r && r.data && r.data.animation)) {
              let u = this._rendererCache.get(s);
              return (
                u ||
                  ((u = new X0("", s, this.engine, () =>
                    this._rendererCache.delete(s),
                  )),
                  this._rendererCache.set(s, u)),
                u
              );
            }
            const o = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, e);
            const l = (u) => {
              Array.isArray(u)
                ? u.forEach(l)
                : this.engine.registerTrigger(o, a, e, u.name, u);
            };
            return r.data.animation.forEach(l), new A4(this, a, s, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(e, r, i) {
            e >= 0 && e < this._microtaskId
              ? this._zone.run(() => r(i))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach((s) => {
                        const [o, a] = s;
                        o(a);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([r, i]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(),
                    this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(lo), m(Au), m(le));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class X0 {
        constructor(t, e, r, i) {
          (this.namespaceId = t),
            (this.delegate = e),
            (this.engine = r),
            (this._onDestroy = i),
            (this.destroyNode = this.delegate.destroyNode
              ? (s) => e.destroyNode(s)
              : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate),
            this.delegate.destroy(),
            this._onDestroy?.();
        }
        createElement(t, e) {
          return this.delegate.createElement(t, e);
        }
        createComment(t) {
          return this.delegate.createComment(t);
        }
        createText(t) {
          return this.delegate.createText(t);
        }
        appendChild(t, e) {
          this.delegate.appendChild(t, e),
            this.engine.onInsert(this.namespaceId, e, t, !1);
        }
        insertBefore(t, e, r, i = !0) {
          this.delegate.insertBefore(t, e, r),
            this.engine.onInsert(this.namespaceId, e, t, i);
        }
        removeChild(t, e, r) {
          this.engine.onRemove(this.namespaceId, e, this.delegate, r);
        }
        selectRootElement(t, e) {
          return this.delegate.selectRootElement(t, e);
        }
        parentNode(t) {
          return this.delegate.parentNode(t);
        }
        nextSibling(t) {
          return this.delegate.nextSibling(t);
        }
        setAttribute(t, e, r, i) {
          this.delegate.setAttribute(t, e, r, i);
        }
        removeAttribute(t, e, r) {
          this.delegate.removeAttribute(t, e, r);
        }
        addClass(t, e) {
          this.delegate.addClass(t, e);
        }
        removeClass(t, e) {
          this.delegate.removeClass(t, e);
        }
        setStyle(t, e, r, i) {
          this.delegate.setStyle(t, e, r, i);
        }
        removeStyle(t, e, r) {
          this.delegate.removeStyle(t, e, r);
        }
        setProperty(t, e, r) {
          "@" == e.charAt(0) && e == Q0
            ? this.disableAnimations(t, !!r)
            : this.delegate.setProperty(t, e, r);
        }
        setValue(t, e) {
          this.delegate.setValue(t, e);
        }
        listen(t, e, r) {
          return this.delegate.listen(t, e, r);
        }
        disableAnimations(t, e) {
          this.engine.disableAnimations(t, e);
        }
      }
      class A4 extends X0 {
        constructor(t, e, r, i, s) {
          super(e, r, i, s), (this.factory = t), (this.namespaceId = e);
        }
        setProperty(t, e, r) {
          "@" == e.charAt(0)
            ? "." == e.charAt(1) && e == Q0
              ? this.disableAnimations(t, (r = void 0 === r || !!r))
              : this.engine.process(this.namespaceId, t, e.slice(1), r)
            : this.delegate.setProperty(t, e, r);
        }
        listen(t, e, r) {
          if ("@" == e.charAt(0)) {
            const i = (function T4(n) {
              switch (n) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return n;
              }
            })(t);
            let s = e.slice(1),
              o = "";
            return (
              "@" != s.charAt(0) &&
                ([s, o] = (function I4(n) {
                  const t = n.indexOf(".");
                  return [n.substring(0, t), n.slice(t + 1)];
                })(s)),
              this.engine.listen(this.namespaceId, i, s, o, (a) => {
                this.factory.scheduleListenerCallback(a._data || -1, r, a);
              })
            );
          }
          return this.delegate.listen(t, e, r);
        }
      }
      let R4 = (() => {
        class n extends Au {
          constructor(e, r, i, s) {
            super(e.body, r, i);
          }
          ngOnDestroy() {
            this.flush();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(m(Y), m($g), m(em), m(ls));
          }),
          (n.ɵprov = A({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const J0 = [
          { provide: oS, useClass: w4 },
          {
            provide: em,
            useFactory: function x4() {
              return new Z3();
            },
          },
          { provide: Au, useClass: R4 },
          {
            provide: lo,
            useFactory: function O4(n, t, e) {
              return new M4(n, t, e);
            },
            deps: [sc, Au, le],
          },
        ],
        am = [
          { provide: $g, useFactory: () => new D4() },
          { provide: Io, useValue: "BrowserAnimations" },
          ...J0,
        ],
        eA = [
          { provide: $g, useClass: M0 },
          { provide: Io, useValue: "NoopAnimations" },
          ...J0,
        ];
      let k4 = (() => {
        class n {
          static withConfig(e) {
            return { ngModule: n, providers: e.disableAnimations ? eA : am };
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵmod = ve({ type: n })),
          (n.ɵinj = _e({ providers: am, imports: [GD] })),
          n
        );
      })();
      const F4 = { imposters: [] };
      function P4(n = F4, t) {
        switch (t.type) {
          case xM:
            return { ...n, action: t };
          case "GET_IMPOSTER":
            return { ...n, imposters: [n] };
          default:
            return n;
        }
      }
      let N4 = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵmod = ve({ type: n, bootstrap: [MH] })),
          (n.ɵinj = _e({
            providers: [fa],
            imports: [
              GD,
              uV,
              MV,
              kz,
              k4,
              V2,
              OH,
              $H,
              tE,
              dz.forRoot({ imposter: P4 }),
              Iz,
            ],
          })),
          n
        );
      })();
      (function FP() {
        if (zC)
          throw new Error("Cannot enable prod mode after platform setup.");
        $C = !1;
      })(),
        lL()
          .bootstrapModule(N4)
          .catch((n) => console.error(n));
    },
  },
  (ur) => {
    ur((ur.s = 879));
  },
]);
