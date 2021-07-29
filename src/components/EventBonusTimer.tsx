import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks/useStores';

const EventBonusTimer = observer(() => {
  let timerInterval: any;

  const { userProfileStore } = useStores();
  const { t } = useTranslation();

  const [timeLeft, setTimeLeft] = useState('');
  const countDown = () => {
    let eventTime = userProfileStore.bonusExpirationDate,
      currentTime = moment().unix(),
      diffTime = eventTime - currentTime,
      duration: any = moment.duration(diffTime * 1000, 'milliseconds'),
      interval = 1000;

    timerInterval = setInterval(function () {
      currentTime = moment().unix();
      duration = moment.duration(duration - interval, 'milliseconds');

      if (duration.days() > 0) {
        setTimeLeft(
          `${duration.days()} ${t('days')} ${duration.hours()} ${t('hours')}`
        );
        return;
      }

      if (duration.hours() > 0) {
        setTimeLeft(
          `${duration.hours()} ${t('hours')} ${duration.minutes()} ${t(
            'minutes'
          )}`
        );
        return;
      }

      setTimeLeft(
        `${duration.minutes()} ${t('minutes')} ${duration.seconds()} ${t(
          'seconds'
        )}`
      );
    }, interval);
  };

  useEffect(() => {
    countDown();
    // clearInterval
    return () => {
      clearInterval(timerInterval);
    };
  }, [userProfileStore.bonusExpirationDate]);

  return <>{`${t('Only')} ${timeLeft} ${t('left')}`}</>;
});

export default EventBonusTimer;
